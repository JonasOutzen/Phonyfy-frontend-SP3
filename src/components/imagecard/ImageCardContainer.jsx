import styles from "./imagecontainer.module.css";
import Card from "./ArtistCard.jsx";

const CardContainer = ({ cards }) => {
  return (
    <div className={styles.container}>
      {cards.map((card, index) => (
        <Card 
          key={index} 
          truckId={index + 1}
          imageUrl={card.imageUrl} 
          name={card.name} 
          description={card.description} 
        />
      ))}
    </div>
  );
};

export default CardContainer;
