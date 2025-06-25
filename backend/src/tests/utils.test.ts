import { sendError } from '../helpers/utils';

describe('sendError utility', () => {
  it('should set ctx.status and ctx.body with error message', () => {
    const ctx: any = {};
    sendError(ctx, 400, 'Test error');
    expect(ctx.status).toBe(400);
    expect(ctx.body).toEqual({ error: 'Test error' });
  });

  it('should log error if error object is provided', () => {
    const ctx: any = {};
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    sendError(ctx, 500, 'Test error', new Error('fail'));
    expect(consoleSpy).toHaveBeenCalledWith('Test error', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
