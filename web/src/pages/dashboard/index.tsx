import styles from '@/styles/Dashboard.module.scss';
import {Area, NavBar} from '@/components';
import React, {useState, useEffect} from 'react';
import {getUserAreas} from '@/scripts/Utils';
import {AreaType, Config, User} from '@/types';

const Dashboard = ({config, user}: {config: Config; user: User}) => {
  const [areas, setAreas] = useState<Array<AreaType> | null>(null);

  const refreshAreas = async () => {
    const response: Array<AreaType> = await getUserAreas(
      config.api,
      user.token,
      user.id
    );
    if (response) setAreas(response);
  };

  useEffect(() => {
    if (user.token && user.id) refreshAreas();
  }, [user.id]);

  return (
    <div id={styles.login}>
      <NavBar />
      <div id={styles.container}>
        <div id={styles.areas}>
          {areas &&
            areas.map(area => (
              <Area
                config={config}
                key={area.area_id}
                token={user.token}
                id={area.area_id}
                title={area.title}
                refresh={refreshAreas}
              />
            ))}
          {areas && areas.length == 0 && (
            <p className={styles.noArea}>No area.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
