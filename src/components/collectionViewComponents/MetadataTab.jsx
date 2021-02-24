export function MetadataTab({metadata}) {
  return (
    <div id="MetadataTabContentContainer">
      {metadata &&
        Object.entries(metadata).map((v, i) => (
          <div
            key={metadata.collection_id + "_" + v[0]}
            style={
              i === Object.keys(metadata).length - 1
                ? { paddingBottom: "40px" }
                : null
            }
          >
            <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
              {v[1] ? v[0].replaceAll("_", " ") : null}
            </h3>
            <p>{v[1] ? v[1] : null}</p>
          </div>
        ))}
    </div>
  );
}
