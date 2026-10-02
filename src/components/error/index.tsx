import React from "react";

export default function withErrorBoundary<P>(Component: React.ComponentType<P>) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
