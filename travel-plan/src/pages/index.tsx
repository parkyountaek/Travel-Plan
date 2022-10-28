import type { NextPage } from "next";
import Info from "../components/Info/Info";
import KakaoMap from "../components/Map/KakaoMap";
import styles from "../../styles/Home.module.css";
import PlanList from "../components/Plan/PlanList";

const Home: NextPage = () => {
  return (
    <div>
      <div className={styles.container}>
        <KakaoMap />
        <div className={styles.infoContainer}>
          <Info />
          <PlanList />
        </div>
      </div>
      
    </div>
  );
};

export default Home;
