import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import '../../../utils/fix-map-icon';
import styles from './Map.module.scss';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { GeoLocEntity, SimpleAdEntity } from 'types';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux-toolkit/store';
import { SingleAd } from '../../molecules/SingleAd/SingleAd';
import { getGeoCode } from '../../../utils/goecoding';

export const Map = () => {
	const refMap = useRef(null);
	const [ads, setAds] = useState<SimpleAdEntity[]>([]);
	const [geoLoc, setGeoLoc] = useState<GeoLocEntity>({
		latitude: 52.2300205,
		longitude: 21.0063067,
	});
	const { name } = useSelector((store: RootState) => store.search);

	const ChangeView =({ center }: any) => {
		const map = useMap();
		map.setView(center, 15);
		return null;
	}

	useEffect(() => {
		
		(async () => {
			const { latitude, longitude } = await getGeoCode(name ? name : 'Warszawa');
			const res = await fetch(`http://localhost:3001/ad/search-by-loc/${latitude}/${longitude}`);
			const adsData = await res.json();
			setAds(adsData);
			setGeoLoc({ latitude, longitude });
		})();
	}, [name]);

	return (
		<section className={styles.map}>
			<MapContainer
				center={[geoLoc.latitude, geoLoc.longitude]}
				zoom={15}
				ref={refMap}
			>
				<ChangeView center={[geoLoc.latitude, geoLoc.longitude]} />
				<TileLayer
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				{ads.map((ad) => (
					<Marker key={ad.id} position={[ad.latitude, ad.longitude]}>
						<Popup>
							<SingleAd id={ad.id} />
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</section>
	);
};
