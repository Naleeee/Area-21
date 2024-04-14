import styles from './Area.module.scss';
import Image from 'next/image';
import {deleteArea} from '@/scripts/Utils';
import {useRouter} from 'next/router';

const Area = ({
  config,
  token,
  id,
  title,
  refresh,
}: {
  config: any;
  token: string;
  id: number;
  title: string;
  refresh: Function;
}) => {
  const router = useRouter();

  const edit = () => {
    router.push(`/area/${id}`);
  };
  const trash = () => {
    deleteArea(config.api, token, id).then(() => refresh());
  };
  return (
    <div className={styles.area}>
      <p>{title}</p>
      <div>
        <button onClick={edit}>
          <Image src="/icons/Edit.png" alt="EditIcon" width={64} height={64} />
        </button>
        <button onClick={trash}>
          <Image
            src="/icons/Trash.png"
            alt="TrashIcon"
            width={64}
            height={64}
          />
        </button>
      </div>
    </div>
  );
};

export default Area;
