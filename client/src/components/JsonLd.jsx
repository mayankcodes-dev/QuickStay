/**
 * JsonLd — injects structured data (JSON-LD) into <head> via react-helmet-async.
 * Usage:
 *   <JsonLd type="Hotel" data={{ name, address, ... }} />
 *   <JsonLd type="BreadcrumbList" items={[{ name, url }, ...]} />
 *   <JsonLd type="WebSite" /> — for home page SearchAction
 */

import { Helmet } from 'react-helmet-async';

const buildHotelSchema = (data) => ({
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name:        data.name,
  description: data.description || `Book ${data.name} on YoYo Rooms`,
  address: {
    '@type':           'PostalAddress',
    streetAddress:     data.address,
    addressLocality:   data.city,
    addressCountry:    'IN',
  },
  priceRange:   data.priceRange || '₹₹',
  starRating:   data.starRating ? { '@type': 'Rating', ratingValue: data.starRating } : undefined,
  image:        data.image,
  url:          data.url,
  telephone:    data.contact,
  aggregateRating: data.avgRating ? {
    '@type':       'AggregateRating',
    ratingValue:   data.avgRating,
    bestRating:    5,
    worstRating:   1,
    ratingCount:   data.reviewCount || 1,
  } : undefined,
});

const buildBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type':    'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type':  'ListItem',
    position: i + 1,
    name:     item.name,
    item:     item.url,
  })),
});

const buildWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type':    'WebSite',
  name:       'YoYo Rooms',
  url:        'https://yoyorooms.com',
  potentialAction: {
    '@type':       'SearchAction',
    target:        'https://yoyorooms.com/rooms?destination={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
});

const JsonLd = ({ type, data = {}, items = [] }) => {
  let schema;
  if (type === 'Hotel')          schema = buildHotelSchema(data);
  else if (type === 'BreadcrumbList') schema = buildBreadcrumbSchema(items);
  else if (type === 'WebSite')   schema = buildWebSiteSchema();
  else return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 0)}
      </script>
    </Helmet>
  );
};

export default JsonLd;
