/**
 * The Next.js API routes and the Express backend both respond with the
 * shape { success, message, data, errors }. RTK Query endpoints use this to
 * unwrap the payload so components work with plain domain data.
 */
export function unwrapApiResponseData(apiResponseBody) {
  return apiResponseBody?.data;
}
