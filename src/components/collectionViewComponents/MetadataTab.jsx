import { Button, Descriptions, Input, Table, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  emailRegex,
  urlRegex,
} from "../../utilities/regexHelpers/regexHelpers";

const orderedContemporaryMetaKeys = [
  { key: "acquisition_date", label: "acquisition date" },
  { key: "partners", label: "partners" },
  { key: "source_name", label: "source name" },
  { key: "source_website", label: "source website" },
  { key: "source_data_website", label: "source data website" },
  { key: "source_contact", label: "source contact" },
  { key: "spatial_reference", label: "spatial reference" },
  { key: "file_type", label: "file type" },
  { key: "download_formats", label: "download formats" },
  { key: "band_types", label: "bands" },
  { key: "resolution", label: "resolution" }, 
  { key: "category", label: "category" },
];
const orderedHistoricMetaKeys = [
  { key: "source_name", label: "source name" },
  { key: "collection", label: "mission identifier" },
  { key: "media_type", label: "media type" },
  { key: "general_scale", label: "general scale" },
];

const fields = {
  historic: orderedHistoricMetaKeys,
  contemporary: orderedContemporaryMetaKeys,
};

export function MetadataTab({ metadata }) {
  console.log(metadata);
  return (
    <div id="MetadataTabContentContainer">
      {metadata && metadata.category.includes("Historic_Imagery") ? (
        <HistoricMeta metadata={metadata} />
      ) : (
        <ContemporaryMeta metadata={metadata} />
      )}
    </div>
  );
}

function ContemporaryMeta({ metadata }) {
  return (
    <>
      <CollectionDescription about={metadata.description} />
      {metadata &&
        fields["contemporary"].map((k, i) => (
          <div key={metadata.collection_id + "_" + k.key}>
            <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
              {metadata[k.key] ? k.label : null}
            </h3>
            {emailRegex.test(metadata[k.key]) && (
              <a href={`mailto:${metadata[k.key]}`}>{metadata[k.key]}</a>
            )}
            {urlRegex.test(metadata[k.key]) && (
              <a href={`${metadata[k.key]}`}>{metadata[k.key]}</a>
            )}
            {!emailRegex.test(metadata[k.key]) &&
              !urlRegex.test(metadata[k.key]) && (
                <p>{metadata[k.key] ? String(metadata[k.key]) : null}</p>
              )}
          </div>
        ))}
      <HyperLink
        url={metadata.license_url}
        text={metadata.license_name}
        label="license"
      />
    </>
  );
}
function HistoricMeta({ metadata }) {
  return (
    <>
      <CollectionDescription about={metadata.about} />
      {metadata &&
        fields["historic"].map((k, i) => (
          <div key={metadata.collection_id + "_" + k.key}>
            <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
              {metadata[k.key] ? k.label : null}
            </h3>
            {emailRegex.test(metadata[k.key]) && (
              <a href={`mailto:${metadata[k.key]}`}>{metadata[k.key]}</a>
            )}
            {urlRegex.test(metadata[k.key]) && (
              <a href={`${metadata[k.key]}`}>{metadata[k.key]}</a>
            )}
            {!emailRegex.test(metadata[k.key]) &&
              !urlRegex.test(metadata[k.key]) && (
                <p>{metadata[k.key] ? String(metadata[k.key]) : null}</p>
              )}
          </div>
        ))}
      <HistoricScanStatus status={metadata.fully_scanned} />
      <HyperLink
        url={metadata.license_url}
        text={metadata.license_name}
        label="license"
      />
      {metadata.products && <HistoricProducts products={metadata.products} />}
      <AboutHistoric />
    </>
  );
}

export function IndexLink({ label, url, buttonIcon, buttonLabel }) {
  return (
    <div>
      <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>{label}</h3>
      <Input>{url}</Input>
      <Button icon={buttonIcon}>{buttonLabel}</Button>
    </div>
  );
}
export function HyperLink({ url, text, label }) {
  return (
    <div>
      <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>{label}</h3>
      <Link to={url}>{text}</Link>
    </div>
  );
}

export function CollectionDescription({ about }) {
  return (
    <div>
      <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
        description
      </h3>
      <Typography.Paragraph
        ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
      >
        {about}
      </Typography.Paragraph>
    </div>
  );
}
export function HistoricScanStatus({ status }) {
  return (
    <div>
      <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
        scan status
      </h3>
      <Tag color={status ? "green" : "gold"}>
        {status ? <>COMPLETE</> : <>IN PROGRESS</>}
      </Tag>
    </div>
  );
}
export function HistoricProducts({ products }) {
  const productsAsJSON = JSON.parse(products);
  console.log(productsAsJSON);
  const filteredProducts = Object.keys(productsAsJSON).filter((v) =>
    ["medium", "print_type"].includes(v)
  );
  return (
    <div>
      <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>products</h3>
      <p>
        Historic imagery projects occasionally produced multiple printed
        photographs of the same imagery varying in scale, frame size, medium,
        and print type. The available printed photograph products for this
        dataset are listed below.
      </p>
      {filteredProducts && filteredProducts.length > 0 && (
        <Descriptions layout="vertical" bordered size="small">
          {filteredProducts.map((v, i) => {
            return (
              <Descriptions.Item
                label={
                  <h4 style={{ fontVariant: "", fontWeight: "800" }}>
                    {v.replace("_", " ")}
                  </h4>
                }
                key={v + "_" + i}
              >
                <p>{productsAsJSON[v]}</p>
              </Descriptions.Item>
            );
          })}
        </Descriptions>
      )}
    </div>
  );
}
export function AboutHistoric() {
  return (
    <div>
      <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
        about the historic imagery archive
      </h3>
      <p>
        The Historical Imagery Archive maintained by TNRIS is one of our most
        used and important data collections. It is comprised of over 1 million
        frames of photos covering all parts of Texas from dates as far back as
        the 1920s.
      </p>
      <p>
        The TNRIS Research & Distribution Center (RDC) is charged with
        preserving this collection, distributing it to the public, and
        continuing with the large task of digitizing the frames.
      </p>
    </div>
  );
}
