import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb", padding: "1rem" }}>
                    <div style={{ maxWidth: "28rem", width: "100%", backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", padding: "1.5rem", border: "1px solid #fee2e2" }}>
                        <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#dc2626", marginBottom: "1rem" }}>Something went wrong</h1>
                        <p style={{ fontSize: "0.875rem", color: "#4b5563", marginBottom: "1rem" }}>
                            The application encountered a critical error.
                        </p>
                        <div style={{ backgroundColor: "#f3f4f6", padding: "1rem", borderRadius: "0.25rem", overflow: "auto", fontSize: "0.75rem", fontFamily: "monospace", marginBottom: "1rem", border: "1px solid #e5e7eb" }}>
                            <p style={{ fontWeight: "bold", color: "#111827", marginBottom: "0.5rem" }}>{this.state.error?.name}</p>
                            <p style={{ color: "#b91c1c", whiteSpace: "pre-wrap" }}>{this.state.error?.message}</p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            style={{ width: "100%", backgroundColor: "#16a34a", color: "white", padding: "0.5rem 1rem", borderRadius: "0.25rem", border: "none", cursor: "pointer" }}
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
