import { useContext, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./newMovie.css";
import { storage } from "../../firebase";
import { createMovie } from "../../context/movie/apiCalls";
import { MoviesContext } from "../../context/movie/MovieContext";

export default function NewMovie() {
  const { dispatch } = useContext(MoviesContext);
  const [movie, setMovie] = useState({});
  const [img, setImg] = useState(null);
  const [imgSmall, setImgSmall] = useState(null);
  const [imgTitle, setImgTitle] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploaded, setUploaded] = useState(0);

  const handleChange = (e) => {
    const value = e.target.value;
    setMovie({ ...movie, [e.target.name]: value });
  };

  const upload = (items) => {
    items.forEach((item) => {
      const storageRef = ref(storage, `items/${item.file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, item.file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setMovie((prev) => {
              return { ...prev, [item.label]: url };
            });
            console.log(`${item.label}:`, url);
            console.log(movie);
          });

          setUploaded((prev) => prev + 1);
        }
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMovie(movie, dispatch);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    upload([
      { file: img, label: "img" },
      { file: imgTitle, label: "imgTitle" },
      { file: imgSmall, label: "imgSmall" },
      { file: trailer, label: "trailer" },
      { file: video, label: "video" },
    ]);
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Movie</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Image</label>
          <input
            type="file"
            id="img"
            name="img"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Title image</label>
          <input
            type="file"
            id="imgTitle"
            name="imgTitle"
            onChange={(e) => setImgTitle(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Thumbnail</label>
          <input
            type="file"
            id="imgSmall"
            name="imgSmall"
            onChange={(e) => setImgSmall(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input
            type="text"
            placeholder="Spider-Man"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <textarea
            rows="4"
            cols="30"
            placeholder="Description"
            name="desc"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="addProductItem">
          <label>Genre</label>
          <input
            type="text"
            placeholder="Action"
            name="genre"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Duration</label>
          <input
            type="text"
            placeholder="2:10"
            name="duration"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Year</label>
          <input
            type="number"
            placeholder="2021"
            name="year"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Limit</label>
          <input
            type="number"
            placeholder="3"
            name="limit"
            onChange={handleChange}
          />
        </div>

        <div className="addProductItem">
          <label>Is Series?</label>
          <select id="isSeries" name="isSeries" onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className="addProductItem">
          <label>Trailer</label>
          <input
            type="file"
            name="trailer"
            onChange={(e) => setTrailer(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Video</label>
          <input
            type="file"
            name="video"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </div>
        {uploaded === 5 ? (
          <button className="addProductButton" onClick={handleSubmit}>
            Create
          </button>
        ) : (
          <button className="addProductButton" onClick={handleUpload}>
            Upload
          </button>
        )}
      </form>
    </div>
  );
}
