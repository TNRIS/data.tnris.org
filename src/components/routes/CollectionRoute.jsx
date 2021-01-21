import useQuery from "../../utilities/custom-hooks/useQuery";

export default function CollectionRoute() {
  return (
    <div>
      <h2>Collection Route</h2>
      <p>c = {useQuery().get("c") || "does not exist"}</p>
    </div>
  );
}
