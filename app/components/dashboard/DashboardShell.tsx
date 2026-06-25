import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

type DashboardShellProps = {
  children: ReactNode;
  title: string;
};

export function DashboardShell({ children, title }: DashboardShellProps) {
  return (
    <main className="his-dashboard">
      <div className="his-dashboard-layout">
        <Sidebar />

        <section className="his-main-area">
          <header className="his-topbar">
            <div>
              <p className="his-topbar-kicker">Medisystem HIS</p>
              <h1 className="his-topbar-title">{title}</h1>
            </div>

            <div className="his-topbar-actions">
              <button type="button" className="his-icon-button">
                🔔
                <span className="his-dot" />
              </button>

              <button type="button" className="his-icon-button">
                💬
                <span className="his-dot" />
              </button>

              <div className="his-user-chip">
                <div className="his-user-avatar-small">AP</div>

                <div>
                  <p className="his-user-name">dr. Azita Putri</p>
                  <p className="his-user-role">Dokter Umum</p>
                </div>
              </div>
            </div>
          </header>

          <div className="his-content">{children}</div>
        </section>
      </div>
    </main>
  );
}