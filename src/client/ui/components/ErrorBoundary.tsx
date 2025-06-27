import React, { Component, Error, ErrorInfo, ReactComponent } from '@rbxts/react';
import { atom } from '@rbxts/charm';

export const refreshCallbackAtom = atom<{ refresh: () => void }>();

interface ErrorBoundaryProps extends React.PropsWithChildren {
	fallback: (err: Error, errorInfo: ErrorInfo) => React.ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	err?: Error;
	errorInfo?: ErrorInfo;
}

@ReactComponent
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	public state: ErrorBoundaryState = {
		hasError: false,
	};
	
	constructor(props: ErrorBoundaryProps) {
		super(props);
		
		refreshCallbackAtom({
			refresh: () => {
				this.setState({ hasError: false });
			},
		});
	}
	
	public componentDidCatch(err: Error, errorInfo: ErrorInfo) {
		warn(`[client::ui/components/ErrorBoundary] caught an error (${errorInfo.componentStack}):`, err);
		
		this.setState({
			hasError: true,
			err,
			errorInfo,
		});
	}
	
	public render() {
		
		if (this.state.hasError) {
			return this.props.fallback(this.state.err!, this.state.errorInfo!);
		}
		
		return this.props.children;
	}
}

export default ErrorBoundary;
