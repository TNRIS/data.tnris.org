import { DownloadOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Collapse,
  Descriptions,
  Input,
  List,
  Row,
  Tag,
  Tooltip,
  Typography,
} from "antd";
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
              metadata
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
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`${metadata[k.key]}`}
                  >
                    {metadata[k.key]}
                  </a>
                )}
                {!emailRegex.test(metadata[k.key]) &&
                  !urlRegex.test(metadata[k.key]) && (
                    <p>{metadata[k.key] ? String(metadata[k.key]) : null}</p>
                  )}
              </div>
            ))}
        </Collapse.Panel>
      </Collapse>
      <CollectionMapService metadata={metadata} />
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
              metadata
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
      <CollectionMapService metadata={metadata} />
      {metadata.scanned_index_ls4_links && (
        <ScannedIndexes metadata={metadata} />
      )}
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
      <a href={url} rel="noreferrer" target="_blank">
        {text}
      </a>
    </div>
  );
}
////////////////////////////////////////////////////////////////////////
//// Components for Both Historic and Contemporary Collections
////////////////////////////////////////////////////////////////////////
export function CollectionDescription({ about }) {
  return (
    <Card size="small" className="DescriptionCard">
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
              <List.Item
                extra={
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    href={`${item[1]}`}
                  >
                    Download
                  </Button>
                }
              >
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
      <Row justify="start" gutter={8}>
        <Tooltip placement="topRight" title="Share on Facebook">
          <FacebookShareButton
            url={shareUrl}
            quote={shareTitle}
            hashtag="#TNRIS"
          >
            <FacebookIcon size="40" />
          </FacebookShareButton>
        </Tooltip>
        <Tooltip placement="topRight" title="Share on Reddit">
          <RedditShareButton url={shareUrl} title={shareTitle}>
            <RedditIcon size="40" />
          </RedditShareButton>
        </Tooltip>
        <Tooltip placement="topRight" title="Share on Twitter">
          <TwitterShareButton
            url={shareUrl}
            title={tweetTitle}
            className="share-button"
            hashtags={["TNRIS", "DataHolodeck"]}
          >
            <TwitterIcon size="40" />
          </TwitterShareButton>
        </Tooltip>
        <Tooltip placement="topRight" title="Share on Email">
          <EmailShareButton
            url={shareUrl}
            subject={shareTitle}
            body={shareCombo}
          >
            <EmailIcon size="40" />
          </EmailShareButton>
        </Tooltip>
      </Row>
    </Card>
  );
}
export function CollectionMapService({ metadata }) {
  const serviceLink = () => {
    switch (true) {
      case metadata.wms_link.includes("feature"):
        return "https://feature.tnris.org/arcgis/services";
      case metadata.wms_link.includes("imagery"):
        return "https://features.tnris.org/arcgis/services";
      default:
        return "https://webservices.tnris.org/arcgis/services";
    }
  };
  return (
    <>
      {metadata.wms_link && metadata.popup_link && (
        <Card size="small">
          <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
            online mapping services
          </h3>
          <Row>
            <p>
              This dataset is available as an online mapping service. An OGC WMS
              service and an ArcGIS service are available. To connect to the WMS
              service in your software, please copy the unique url provided in
              the box below. To access the TNRIS ArcGIS Server, please use the
              following url in your ESRI software and select from the{" "}
              <a href={serviceLink()}>list of available services</a>.
            </p>

            <Alert
              showIcon
              type="info"
              message={
                <span>
                  For questions regarding the use of one of these services in
                  your software package, please consult the software
                  help/support information.
                </span>
              }
            />
            <Typography.Paragraph
              style={{
                border: "solid 1px #ccc",
                padding: ".25rem .5rem",
                borderRadius: ".25rem",
                overflowWrap: "anywhere",
              }}
              copyable={{
                tooltips: ["Click to copy citation", "You copied this link"],
                text: metadata.wms_link,
              }}
            >
              {<span>{metadata.wms_link}</span>}
            </Typography.Paragraph>
            <br />
            <Button
              color="primary"
              type="primary"
              href={metadata.popup_link}
              target="_blank"
            >
              Open ArcGIS Map Preview
            </Button>
          </Row>
        </Card>
      )}
    </>
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
  const productsAsJSON = JSON.parse("[" + products + "]");
  const uniqueProducts = productsAsJSON.reduce((r, e) => {
    r[e.medium + "_" + e.print_type] = {
      medium: e.medium,
      print_type: e.print_type,
    };
    return r;
  }, {});

  return (
    <Card size="small">
      <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>products</h3>
      <p>
        Historic imagery projects occasionally produced multiple printed
        photographs of the same imagery varying in scale, frame size, medium,
        and print type. The available printed photograph products for this
        dataset are listed below.
      </p>
      {uniqueProducts && productsAsJSON.length > 0 && (
        <Descriptions layout="vertical" bordered size="small">
          {Object.keys(uniqueProducts).map((v, i) => {
            return (
              <Descriptions.Item
                label={
                  <h4 style={{ fontVariant: "", fontWeight: "800" }}>
                    {uniqueProducts[v].medium.replace("_", " ")}
                  </h4>
                }
                key={v + "_" + i}
              >
                <p>{uniqueProducts[v].print_type}</p>
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

export function ScannedIndexes({ metadata }) {
  const idxAsJson = JSON.parse("[" + metadata.scanned_index_ls4_links + "]");

  return (
    <Card size="small">
      <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
        scanned indexes
      </h3>
      <p>
        This Historic Imagery dataset has scanned indexes (.tif format)
        available for download. Use the scanned indexes to view this
        collection's spatial extent and the identification numbers of the
        individual frames which comprise it.
      </p>
      <Alert
        showIcon
        type="info"
        message={
          <span>
            Frames shown within each index sheet may or may not be availabile
            due to incomplete collections within the archive.
          </span>
        }
      />
      <List
        bordered
        dataSource={idxAsJson}
        itemLayout={"horizontal"}
        renderItem={(item) => (
          <List.Item
            extra={
              <Button type="link" icon={<DownloadOutlined />} href={item.link}>
                Download
              </Button>
            }
          >
            <List.Item.Meta
              title={
                "Sheet " +
                item.sheet +
                " " +
                metadata.source_abbreviation +
                " " +
                item.year
              }
              description={item.size}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
//////////////////////////////////////////
///////// Components for Lidar Collections
//////////////////////////////////////////
export function AboutLidar() {
  return (
    <Card size="small">
      <p>
        Lidar data for Texas is available online through the use of
        <a href="https://rapidlasso.com/lastools/">LASTools</a>, an open-source
        collection of tools for lidar data viewing and manipulation.
      </p>
      Click
      <a href="https://cdn.tnris.org/data/lidar/tnris-lidar_48_vector.zip">
        here
      </a>
      to download a complete index of all available lidar data at TNRIS.
    </Card>
  );
}
