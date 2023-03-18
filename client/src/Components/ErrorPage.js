import logo from "../Images/404.gif";

export default function NotFound() {
  return (
    <div id="image-container">
        <img
          id="notFoundGif"
          src={logo}
          alt="Resource user is trying to access does not exist"
        ></img>
    </div>
  );
}
