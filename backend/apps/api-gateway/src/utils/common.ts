import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';

export function generatePublicImageUrl(
  path: string,
  baseUrl: string,
  queryParams?: Record<string, string>,
): string {
  if (!path || typeof path !== 'string') return '';
  else if (path.startsWith('http')) return path; // If path is already a full URL, return it as is

  // Normalize baseUrl and path to avoid duplicate slashes
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, ''); // Remove trailing slashes
  const normalizedPath = path.replace(/^\/+/, ''); // Remove leading slashes

  // Generate the base URL
  let imageUrl = `${normalizedBaseUrl}/${normalizedPath}`;

  // Add query parameters if provided
  if (queryParams && Object.keys(queryParams).length > 0) {
    const queryString = new URLSearchParams(queryParams).toString();
    imageUrl += `?${queryString}`;
  }

  return imageUrl;
}

export function emptyPaginationResponse({
  page,
  pageSize,
  totalCount,
}: {
  page: number;
  pageSize: number;
  totalCount: number;
}) {
  const emptyPageMeta = new PageMetaDto({
    pageOptions: { page, pageSize },
    totalCount,
  });

  return new PageDto([], emptyPageMeta);
}

export function isValidUUID(str: string) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
  return uuidRegex.test(str);
}

export function constructFullName(
  firstName?: string,
  lastName?: string,
  order: 'first-last' | 'last-first' = 'last-first',
) {
  if (!firstName && !lastName) return '';
  if (!firstName) return lastName;
  if (!lastName) return firstName;

  if (order === 'first-last') return `${firstName} ${lastName}`;

  return `${lastName} ${firstName}`;
}
