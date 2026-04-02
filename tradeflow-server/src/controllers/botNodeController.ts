import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";

export const getNodes = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const nodes = await prisma.botNode.findMany({
      where: { userId },
      include: {
        metrics: {
          orderBy: { timestamp: "desc" },
          take: 1
        },
        processes: true
      }
    });

    // Map to include status based on heartbeat (Offline if > 60s)
    const processedNodes = nodes.map(node => {
      const isStale = !node.lastHeartbeat || (Date.now() - new Date(node.lastHeartbeat).getTime() > 60000);
      return {
        ...node,
        status: isStale ? "ERROR" : node.status,
        online: !isStale
      };
    });

    res.json(processedNodes);
  } catch (err) {
    next(err);
  }
};

export const heartbeat = async (req: any, res: Response, next: NextFunction) => {
  try {
    // 1. Get Node Info from Auth (Not body, for security)
    const nodeId = req.node?.nodeId;
    if (!nodeId) return res.status(401).json({ error: "Unauthorized node" });

    const { 
      cpuUsage, 
      ramUsage, 
      diskUsage, 
      status, 
      processes // New: Array of { name, pid, cpu, ram, status, uptime }
    } = req.body;

    // 2. Update Node Status & Last Heartbeat
    const node = await (prisma as any).botNode.update({
      where: { id: nodeId },
      data: {
        lastHeartbeat: new Date(),
        status: status || "RUNNING"
      }
    });

    // 3. Log Performance Metrics
    if (cpuUsage !== undefined && ramUsage !== undefined) {
      await (prisma as any).botNodeMetric.create({
        data: {
          nodeId: node.id,
          cpuUsage: parseFloat(cpuUsage),
          ramUsage: parseFloat(ramUsage),
          diskUsage: diskUsage ? parseFloat(diskUsage) : null,
        }
      });
    }

    // 4. Log/Update Process Stats
    if (processes && Array.isArray(processes)) {
      // Clean old process snapshots for this node (keep it light)
      await (prisma as any).botNodeProcess.deleteMany({ where: { nodeId: node.id } });
      
      // Create new snapshots
      for (const p of processes) {
        await (prisma as any).botNodeProcess.create({
          data: {
            nodeId: node.id,
            processName: p.name,
            pid: parseInt(p.pid),
            cpuUsage: parseFloat(p.cpu),
            ramUsage: parseFloat(p.ram),
            status: p.status || "running",
            uptime: p.uptime ? parseInt(p.uptime) : null
          }
        });
      }
    }

    res.json({ success: true, timestamp: new Date() });
  } catch (err) {
    next(err);
  }
};
