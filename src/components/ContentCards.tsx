import React, { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CONTENT_CARDS } from "../gql/queries";
import {
  Spinner,
  Alert,
  AlertIcon,
  Input,
  Box,
  Image,
  Text,
  Flex,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import debounce from "lodash/debounce";
import { getViewportDimensions } from "../utils/viewPortUtils";
import {
  ContentCardsData,
  ContentCardsVars,
  PodcastType,
} from "../types/cardType";
import CustomSeparator from "./CustomSeperator";
import "../styles/cards.css";

const SearchBar: React.FC<{ handleSearch: (value: string) => void }> = ({
  handleSearch,
}) => {
  const imageSrc = useBreakpointValue({
    base: "public/smallLogo.png",
    md: "public/logo.png",
  });

  return (
    <Box className="search-bar">
      <Image src={imageSrc} alt="Logo" className="company-logo" />
      <Input
        placeholder="Search..."
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
      />
    </Box>
  );
};

const ContentCards: React.FC = () => {
  const [keywords, setKeywords] = useState("");
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [resizedImages, setResizedImages] = useState<{ [key: string]: string }>(
    {}
  );

  const { loading, error, data, fetchMore } = useQuery<
    ContentCardsData,
    ContentCardsVars
  >(GET_CONTENT_CARDS, {
    variables: { limit: 20, keywords, types: ["PODCAST"] },
  });

  const handleSearch = useCallback(
    debounce((value: string) => setKeywords(value), 300),
    []
  );

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || isFetchingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsFetchingMore(true);
          fetchMore({
            variables: { limit: 20, keywords, types: ["PODCAST"] },
            updateQuery: (prevResult, { fetchMoreResult }) => {
              setIsFetchingMore(false);
              if (!fetchMoreResult) return prevResult;
              return {
                ...prevResult,
                contentCards: {
                  ...prevResult.contentCards,
                  edges: [
                    ...prevResult.contentCards.edges,
                    ...fetchMoreResult.contentCards.edges,
                  ],
                },
              };
            },
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, isFetchingMore, fetchMore, keywords]
  );

  const calculateResizedImages = useCallback((imageUrls: string[]) => {
    const { maxWidth: width, maxHeight: height } = getViewportDimensions();

    const promises = imageUrls.map((url) => {
      return new Promise<string>((resolve) => {
        const urlParts = url.split("/");
        const baseUrl = urlParts.slice(0, 3).join("/");
        const imagePath = urlParts.slice(3).join("/");
        const resizedUrl = `${baseUrl}/resize/${width}x${height}/${imagePath}`;
        resolve(resizedUrl);
      });
    });

    Promise.all(promises).then((resizedUrls) => {
      const updatedResizedImages = imageUrls.reduce((acc, url, index) => {
        acc[url] = resizedUrls[index];
        return acc;
      }, {} as { [key: string]: string });

      setResizedImages(updatedResizedImages);
    });
  }, []);

  useEffect(() => {
    if (data) {
      const imageUrls = data.contentCards.edges.map((card) => card.image.uri);
      calculateResizedImages(imageUrls);
    }
  }, [data, calculateResizedImages]);

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error: {error.message}
      </Alert>
    );
  }

  return (
    <Box className="content-cards-container">
      <SearchBar handleSearch={handleSearch} />
      <Text className="library-title">Tigerhall Library</Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 5 }} spacing={4}>
        {data?.contentCards.edges.map((card: PodcastType, index) => {
          const optimizedImageUrl =
            resizedImages[card.image.uri] || card.image.uri;
          const isLastElement = index === data.contentCards.edges.length - 1;

          return (
            <Box
              key={`${card.name}.${index}`}
              ref={isLastElement ? lastElementRef : null}
              className="card-container"
            >
              <Box className="image-container">
                <Image
                  src={optimizedImageUrl}
                  alt={card.name}
                  className="card-image"
                />
                <Text className="progress-text">30% Completed</Text>
                <Image
                  src="public/music.png"
                  alt="Music icon"
                  className="icon-bottom-left"
                />
                <Image
                  src="public/time.png"
                  alt="Time icon"
                  className="icon-bottom-right"
                />
              </Box>
              <CustomSeparator />

              <Box className="card-details">
                <Text className="card-category">
                  {card.categories
                    .map((category) =>
                      category.name.split(" ").slice(-1).join(" ").toUpperCase()
                    )
                    .join(", ")}
                </Text>
                <Text className="card-name">{card.name}</Text>
                <Text className="card-experts">
                  {card.experts
                    .map((expert) => `${expert.firstName} ${expert.lastName}`)
                    .join(", ")}
                </Text>
                <Text className="card-companies">
                  {card.experts.map((expert) => expert.company).join(", ")}
                </Text>
                <Box className="icons-container">
                  <Image src="public/Share.png" alt="Share icon" />
                  <Image src="public/Bookmark.png" alt="Bookmark icon" />
                </Box>
              </Box>
            </Box>
          );
        })}
        {isFetchingMore && (
          <Flex className="fetching-more">
            <Spinner
              size="md"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.300"
              className="spinner"
            />
            <Text className="fetching-text">Fetching more content...</Text>
          </Flex>
        )}
      </SimpleGrid>
      {loading && !isFetchingMore && (
        <Flex className="loading-overlay">
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.5s"
            emptyColor="gray.200"
            colorScheme="blackAlpha"
            label="Loading content..."
          />
        </Flex>
      )}
    </Box>
  );
};

export default ContentCards;
