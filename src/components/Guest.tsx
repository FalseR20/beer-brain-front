import Template from "./Template.tsx";

export default function Guest() {
  return (
    <Template title={"Guest page"}>
      <div className={"d-flex flex-column align-items-center"}>
        <img
          alt={""}
          src={"BeerBrain-nobg.png"}
          style={{width: "20rem", height: "20rem"}}
        />
        <p className={"fs-1 p-1 text-center"}>
          Don't forget to remind your friends that the <b>beer</b> was not free!
        </p>
      </div>
    </Template>
  );
}
