import {
  Button,
  Card,
  Collapse,
  Descriptions,
  Input,
  List,
  Row,
  Tag,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
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
//////////////////////////////////////////////////////////////////////////////////////////
//// Components for Aggregated Metadata Display based on Historic or Contemporary Type
//////////////////////////////////////////////////////////////////////////////////////////
function ContemporaryMeta({ metadata }) {
  return (
    <div style={{ display: "grid", gap: ".25rem" }}>
      <CollectionDescription about={metadata.description} />
      <Collapse>
        <Collapse.Panel
          header={
            <h3
              style={{
                fontVariant: "small-caps",
                fontWeight: "800",
                margin: 0,
              }}
            >
              detailed metadata
            </h3>
          }
        >
          {metadata &&
            fields["contemporary"].map((k, i) => (
              <div key={metadata.collection_id + "_" + k.key}>
                <h4 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
                  {metadata[k.key] ? k.label : null}
                </h4>
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
        </Collapse.Panel>
      </Collapse>

      <CollectionSupplementalDownloads metadata={metadata} />
      <Card size="small">
        <HyperLink
          url={metadata.license_url}
          text={metadata.license_name}
          label="license"
        />
      </Card>
      <CollectionCitation metadata={metadata} />

      <CollectionSocialShare />
    </div>
  );
}
function HistoricMeta({ metadata }) {
  return (
    <div style={{ display: "grid", gap: ".25rem" }}>
      <CollectionDescription about={metadata.about} />
      <HistoricScanStatus status={metadata.fully_scanned} />
      <Collapse>
        <Collapse.Panel
          header={
            <h3
              style={{
                fontVariant: "small-caps",
                fontWeight: "800",
                margin: 0,
              }}
            >
              detailed metadata
            </h3>
          }
        >
          {metadata &&
            fields["contemporary"].map((k, i) => (
              <div key={metadata.collection_id + "_" + k.key}>
                <h4 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
                  {metadata[k.key] ? k.label : null}
                </h4>
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
        </Collapse.Panel>
      </Collapse>
      {metadata.products && <HistoricProducts products={metadata.products} />}
      <CollectionSupplementalDownloads metadata={metadata} />
      <AboutHistoric />
      <Card size="small">
        <HyperLink
          url={metadata.license_url}
          text={metadata.license_name}
          label="license"
        />
      </Card>
      <CollectionCitation metadata={metadata} />
      <CollectionSocialShare />
    </div>
  );
}
//////////////////////////////////////////////
//// Components for General Use
//////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////
//// Components for Both Historic and Contemporary Collections
////////////////////////////////////////////////////////////////////////
export function CollectionDescription({ about }) {
  return (
    <Card size="small">
      <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
        description
      </h3>
      <div dangerouslySetInnerHTML={{ __html: about }} />
    </Card>
  );
}
export function CollectionCitation({ metadata }) {
  const now = new Date();
  const dateString = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  const sourceCitationText = `${metadata.source_name} (${metadata.source_abbreviation}). ${metadata.name}, ${metadata.acquisition_date}. Web. ${dateString}.`;

  return (
    <Card size="small">
      <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
        cite this collection
      </h3>
      <Typography.Paragraph
        style={{
          border: "solid 1px #ccc",
          padding: ".25rem .5rem",
          borderRadius: ".25rem",
        }}
        copyable={{
          tooltips: ["Click to copy citation", "You copied this link"],
        }}
      >
        {sourceCitationText}
      </Typography.Paragraph>
    </Card>
  );
}
export function CollectionSupplementalDownloads({ metadata }) {
  const items = Object.entries(metadata).filter((v) => {
    return (
      [
        "supplemental_report_url",
        "lidar_breaklines_url",
        "tile_index_url",
        "lidar_buildings_url",
      ].includes(v[0]) && v[1]
    );
  });
  return (
    <>
      {items && items.length > 0 && (
        <Card size="small">
          <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
            supplemental downloads
          </h3>
          <List
            bordered
            dataSource={items}
            renderItem={(item) => (
              <List.Item extra={<a href={`${item[1]}`}>Download</a>}>
                <label
                  style={{ textTransform: "capitalize", fontWeight: "500" }}
                >
                  {item[0].replace("_url", "").replace("_", " ")}
                </label>
              </List.Item>
            )}
          ></List>
        </Card>
      )}
      {(!items || items.length < 1) && null}
    </>
  );
}
export function CollectionSocialShare({ metadata }) {
  const shareUrl = `${window.location.href}`;
  const shareTitle = "Check out this TNRIS DataHub data!";
  const shareCombo = `${shareTitle} ${shareUrl}`;

  // react-share use of url for twitter doesn't like the brackets in a filtered
  // catalog url (despite twitter accepts the url when tweeted directly) so
  // we must handle this by swapping the url into the title parameter
  const tweetTitle =
    shareUrl.includes("[") || shareUrl.includes("]") ? shareCombo : shareTitle;
  return (
    <Card size="small">
      <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
        share this collection
      </h3>
      <Row justify="start" style={{ gap: ".5rem" }}>
        <FacebookShareButton url={shareUrl} quote={shareTitle} hashtag="#TNRIS">
          <FacebookIcon size="40" />
        </FacebookShareButton>
        <RedditShareButton url={shareUrl} title={shareTitle}>
          <RedditIcon size="40" />
        </RedditShareButton>
        <TwitterShareButton
          url={shareUrl}
          title={tweetTitle}
          className="share-button"
          hashtags={["TNRIS", "DataHolodeck"]}
        >
          <TwitterIcon size="40" />
        </TwitterShareButton>
        <EmailShareButton url={shareUrl} subject={shareTitle} body={shareCombo}>
          <EmailIcon size="40" />
        </EmailShareButton>
      </Row>
    </Card>
  );
}
//////////////////////////////////////////////
//// Components for Historical Collections
//////////////////////////////////////////////
export function HistoricScanStatus({ status }) {
  return (
    <Card size="small">
      <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
        scan status
      </h3>
      <Tag color={status ? "green" : "gold"}>
        {status ? <>COMPLETED</> : <>IN PROGRESS</>}
      </Tag>
    </Card>
  );
}
export function HistoricProducts({ products }) {
  const productsAsJSON = JSON.parse(products);
  console.log(productsAsJSON);
  const filteredProducts = Object.keys(productsAsJSON).filter((v) =>
    ["medium", "print_type"].includes(v)
  );
  return (
    <Card size="small">
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
    </Card>
  );
}
export function AboutHistoric() {
  return (
    <Card size="small">
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
    </Card>
  );
}

export function AboutLidar() {
  return (
    <Card size="small">
      <p>
        Lidar data for Texas is available online through the use of{" "}
        <a href="https://rapidlasso.com/lastools/">LASTools</a>, an open-source
        collection of tools for lidar data viewing and manipulation.
      </p>
      Click{" "}
      <a href="https://cdn.tnris.org/data/lidar/tnris-lidar_48_vector.zip">
        here
      </a>{" "}
      to download a complete index of all available lidar data at TNRIS.
    </Card>
  );
}
