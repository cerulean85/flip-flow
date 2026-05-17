export interface ApiErrorResponse<TCode extends string = string> {
  errorCode: TCode
  error: string
}

export function apiErrorResponse<TCode extends string>(
  code: TCode,
  status: number,
  detail?: string
): Response {
  const body: ApiErrorResponse<TCode> = { errorCode: code, error: detail ?? code }
  return Response.json(body, { status })
}
