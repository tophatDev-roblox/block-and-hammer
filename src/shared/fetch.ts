import { HttpService } from '@rbxts/services';

interface RequestInit {
	method: RequestAsyncRequest['Method'];
	body?: string;
	headers?: Record<string, string | Secret>;
}

export default function fetch(url: string, init: RequestInit): Promise<RequestAsyncResponse> {
	return new Promise<RequestAsyncResponse>((resolve, reject) => {
		try {
			const response = HttpService.RequestAsync({
				Url: url,
				Method: init.method,
				Body: init.body,
				Headers: init.headers as Record<string, string>,
			});
			
			resolve(response);
		} catch (err) {
			reject(err);
		}
	});
}
