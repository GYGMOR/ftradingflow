use sysinfo::System;
use serde::{Serialize, Deserialize};
use std::sync::{Arc, Mutex};

#[derive(Serialize, Deserialize)]
struct SystemStats {
    cpu_usage: f32,
    ram_usage: f32,
    ram_total: f32,
    os_name: String,
}

#[derive(Serialize, Deserialize)]
struct ProcessStatus {
    is_running: bool,
    pid: u32,
}

struct AppState {
    system: Arc<Mutex<System>>,
}

// Command: Get Real-Time System Telemetry
#[tauri::command]
fn get_system_stats(state: tauri::State<AppState>) -> SystemStats {
    let mut sys = state.system.lock().unwrap();
    sys.refresh_cpu_usage();
    sys.refresh_memory();

    SystemStats {
        cpu_usage: sys.global_cpu_info().cpu_usage(),
        ram_usage: (sys.used_memory() as f32 / (1024 * 1024 * 1024) as f32), // GB
        ram_total: (sys.total_memory() as f32 / (1024 * 1024 * 1024) as f32), // GB
        os_name: System::name().unwrap_or_else(|| "Unknown".into()),
    }
}

// Command: Check for Trading Bot Activity
#[tauri::command]
fn check_bot_status(state: tauri::State<AppState>, process_name: &str) -> ProcessStatus {
    let mut sys = state.system.lock().unwrap();
    sys.refresh_processes();

    for (pid, process) in sys.processes() {
        if process.name().to_lowercase().contains(&process_name.to_lowercase()) {
            return ProcessStatus {
                is_running: true,
                pid: pid.as_u32(),
            };
        }
    }

    ProcessStatus {
        is_running: false,
        pid: 0,
    }
}

fn main() {
    let mut sys = System::new_all();
    sys.refresh_all();

    let state = AppState {
        system: Arc::new(Mutex::new(sys)),
    };

    tauri::Builder::default()
        .manage(state)
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_system_stats,
            check_bot_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
