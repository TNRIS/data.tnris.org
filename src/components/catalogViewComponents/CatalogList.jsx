//import { useRef } from "react";
//import ReactDOM from "react-dom";
import { Col, Empty, Input, message, PageHeader, Spin } from "antd";
import { useEffect, useState } from "react";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
//import centerOfMass from "@turf/center-of-mass";
import { fetchCatalogCollectionsSelector } from "../../atoms/catalogAtoms";
import { mapAtom } from "../../atoms/mapAtoms";
import { ClearAllFilters } from "./filterBarComponents/ClearAllFilters";
import { FilterBar } from "./filterBarComponents/FilterBar";
import { GeoFilterDrawToggle } from "./filterBarComponents/GeoFilterDrawToggle";
import { GeoFilterSearchBar } from "./filterBarComponents/GeoFilterSearchBar";
import { KeywordSearchBar } from "./filterBarComponents/KeywordSearchBar";
import { CatalogListCard } from "./ListCard";
import { CatalogPaginationControls } from "./PaginationControls";
import { ViewMapSwitch } from "./ViewMapSwitch";
//import maplibreGl from "maplibre-gl";
//import { BrowserRouter, Link, useHistory } from "react-router-dom";

export function LazyBackground(props) {
  const [source, setSource] = useState(null);
  useEffect(() => {
    const { src } = props;

    const imageLoader = new Image();
    imageLoader.src = src;

    imageLoader.onload = () => {
      setSource({ src });
    };
  }, [props]);

  return (
    <div
      {...props}
      style={{
        backgroundImage: `url(${source || props.placeholder})`,
      }}
    />
  );
}

export function CatalogList() {
  //const history = useHistory();

  //const popUpRef = useRef(new maplibreGl.Popup({ offset: 15 }));
  const { state, contents } = useRecoilValueLoadable(
    fetchCatalogCollectionsSelector
  );
  const MAP = useRecoilValue(mapAtom);

  // ADD MAP MARKERS TO MAP
  // WORK IN PROGRESS
  // TODO: Remove / close popup on cataloglist unmount
  // TODO: Prettify popup component

  /*   useEffect(() => {
    if (MAP && contents && contents.results) {
      const centroids = contents.results
        .filter((c) => c.the_geom)
        .map((c) => {
          return {
            ...centerOfMass(c.the_geom),
            properties: {
              collection_id: c.collection_id,
              name: c.name,
              description: c.description,
              thumbnail_image: c.thumbnail_image,
              category: c.category,
              availability: c.availability,
              acquisition_date: c.acquisition_date,
            },
          };
        });

      if (MAP.getSource("collection_centroids") !== undefined) {
        MAP.removeLayer("collection_centroids");
        MAP.removeSource("collection_centroids");
      }

      MAP.addSource("collection_centroids", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: centroids,
        },
      });
      MAP.addLayer({
        id: "collection_centroids",
        type: "symbol",
        source: "collection_centroids",
        layout: {
          // get the title name from the source's "title" property
          "icon-image": "custom-marker",
          "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 15, 1],
          "icon-allow-overlap": true,
          "icon-anchor": "center",
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 5, 1, 15, 24],
          "text-anchor": "bottom",
          "text-optional": true,
        },
      });

      MAP.on("click", "collection_centroids", (e) => {
        // Copy coordinates array.
        const properties = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();
        const popupNode = document.createElement("div");

        ReactDOM.render(
          <Card
            title={properties.name}
            onClick={() =>
              history.push(`/collection?c=${properties.collection_id}`)
            }
          >
            <p>{properties.category}</p>
          </Card>,
          popupNode
        );
        popUpRef.current
          .setLngLat(coordinates)
          .setDOMContent(popupNode)
          .addTo(MAP);
      });
    }
  }, [MAP, state, contents, history]); */

  //if results returned, notify how many with toast
  useEffect(() => {
    if (state === "error") {
      message.loading({
        content: `Error fetching collections. Please try again shortly.`,
        key: "catalogCount",
        style: { position: "fixed", bottom: "2.4rem" },
      });
    }
    if (state === "loading") {
      message.loading({
        content: `Searching for collections...`,
        key: "catalogCount",
        style: { position: "fixed", bottom: "2.4rem" },
      });
    }
    if (state === "hasValue") {
      message.success({
        content: `${contents.count} collections found`,
        key: "catalogCount",
        style: { position: "fixed", bottom: "2.4rem" },
      });
    }
  }, [state, contents]);

  // cleanup catalog map layers when <CatalogList /> is destroyed
  useEffect(() => {
    return () => {
      if (MAP && MAP.getSource("collection_centroids") !== undefined) {
        MAP.removeLayer("collection_centroids");
        MAP.removeSource("collection_centroids");
      }
    };
  }, [MAP]);

  return (
    <Col id={"CatalogViewContainer"}>
      <div>
        <Input.Group className="CatalogSearchBar">
          <KeywordSearchBar />
          <GeoFilterSearchBar placeholder="Search collections by geolocation" />
          <GeoFilterDrawToggle />
        </Input.Group>
        <div className={"FilterRow"}>
          <FilterBar />
        </div>

        <PageHeader
          subTitle={<ViewMapSwitch />}
          extra={<CatalogPaginationControls />}
          className="CatalogHeaderControlPanel"
        />
      </div>
      <div id={"CatalogListContainer"}>
        <Spin
          spinning={state === "loading"}
          tip={"Loading data collections, please wait"}
          style={{ paddingTop: "124px" }}
        >
          {contents.results && contents.results.length > 0 && (
            <>
              <div className="CatalogGrid">
                {contents.results.length > 0 &&
                  contents?.results?.map((v) => (
                    <CatalogListCard collection={v} key={v.collection_id} />
                  ))}
              </div>
            </>
          )}
          {contents.results && contents.results.length === 0 && (
            <Empty description={"No results found for that search query"}>
              <ClearAllFilters />
            </Empty>
          )}
        </Spin>
      </div>
    </Col>
  );
}
