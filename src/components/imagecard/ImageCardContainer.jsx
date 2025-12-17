import styles from "./imagecontainer.module.css";
import Card from "./ArtistCard.jsx";

const CardContainer = ({ cards }) => {
  return (
    <div className={styles.container}>
      {cards.map((card, index) => {

        const image = card.img || card.imageUrl || '/images/artists/default-artist.svg';
        
        return (
          <Card 
            key={card.id} 
            truckId={index + 1}
            imageUrl={image} 
            name={card.name} 
            description={card.description} 
          />
        );
      })}
    </div>
  );
};

export default CardContainer;
