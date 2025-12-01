import { retryWithBackoff } from '../retry';

describe('retryWithBackoff', () => {
  it('succeeds on first attempt', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const result = await retryWithBackoff(fn);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');
    
    const result = await retryWithBackoff(fn, 3, 10);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws error after max retries', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('fail'));
    
    await expect(retryWithBackoff(fn, 2, 10)).rejects.toThrow('fail');
    expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
  });

  it('does not retry on 4xx errors', async () => {
    const axiosError = {
      response: { status: 400 }
    };
    const fn = jest.fn().mockRejectedValue(axiosError);
    
    await expect(retryWithBackoff(fn)).rejects.toEqual(axiosError);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on 5xx errors', async () => {
    const axiosError = {
      response: { status: 500 }
    };
    const fn = jest.fn()
      .mockRejectedValueOnce(axiosError)
      .mockResolvedValue('success');
    
    const result = await retryWithBackoff(fn, 3, 10);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

