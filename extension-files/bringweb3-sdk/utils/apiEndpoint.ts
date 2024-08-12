
export class ApiEndpoint {
  private static instance: ApiEndpoint | null = null;
  private apiEndpoint: string = '';

  private constructor() {
  }

  public static getInstance(): ApiEndpoint {
    if (!ApiEndpoint.instance) {
      ApiEndpoint.instance = new ApiEndpoint();
    }
    return ApiEndpoint.instance;
  }

  public setApiEndpoint(endpoint: string): void {
    this.apiEndpoint = endpoint === 'prod'
      ? 'https://api.bringweb3.io/v1/extension'
      : 'https://sandbox-api.bringweb3.io/v1/extension';
  }

  public getApiEndpoint(): string {
    if (!this.apiEndpoint) {
      throw new Error('API endpoint not set. Call setApiEndpoint first.');
    }
    return this.apiEndpoint;
  }
}