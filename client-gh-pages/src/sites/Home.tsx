import BackendData from "./config.json";

function Home() {
    return (
        <>
        <div className="gallery">
          {BackendData.map((item) => (
            <div className="gallery-item">
                <img src={item.href} alt={item.alt} />
                <figcaption className="figure-caption">{item.alt}</figcaption>
            </div>  
          ))}
        </div>
      </>
    );
}

export default Home;