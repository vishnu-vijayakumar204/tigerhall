import { gql } from '@apollo/client';

// Define fragments for reusable parts of your query
const IMAGE_FRAGMENT = gql`
  fragment Image on Image {
    uri
  }
`;

const CATEGORY_FRAGMENT = gql`
  fragment Category on Category {
    name
  }
`;

const EXPERT_FRAGMENT = gql`
  fragment Expert on Expert {
    firstName
    lastName
    title
    company
  }
`;

// Define the main query for fetching content cards
export const GET_CONTENT_CARDS = gql`
  query GetContentCards($limit: Int!, $keywords: String!, $types: [ContentType!]) {
    contentCards(filter: { limit: $limit, keywords: $keywords, types: $types }) {
      edges {
        ... on Podcast {
          name
          image {
            ...Image
          }
          categories {
            ...Category
          }
          experts {
            ...Expert
          }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  ${EXPERT_FRAGMENT}
`;
