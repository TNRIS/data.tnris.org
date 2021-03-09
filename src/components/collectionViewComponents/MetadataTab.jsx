import { emailRegex, urlRegex } from "../../utilities/regexHelpers/regexHelpers";

export function MetadataTab({metadata}) {
  return (
    <div id="MetadataTabContentContainer">
      {metadata &&
        orderedMetaKeys.map((k,i) => (
          <div
            key={metadata.collection_id + "_" + k}
            style={
              i === Object.keys(metadata).length - 1
                ? { paddingBottom: "40px" }
                : null
            }
          >
            <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
              {metadata[k] ? k.replaceAll("_", " ") : null}
            </h3>
            {emailRegex.test(metadata[k]) && <a href={`mailto:${metadata[k]}`}>{metadata[k]}</a>}
            {urlRegex.test(metadata[k]) && <a href={`${metadata[k]}`}>{metadata[k]}</a>}
            {!emailRegex.test(metadata[k]) && !urlRegex.test(metadata[k]) && <p>{metadata[k] ? metadata[k] : null}</p>}
          </div>
        ))}
    </div>
  );
}

const orderedMetaKeys = ["description", "partners", "source_name", "source_data_website", "source_contact", "spatial_reference", "license", "file_type", "download_formats", "bands", "category"]
