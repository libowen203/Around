import React, {Component} from 'react';
import {GoogleMap, withGoogleMap, withScriptjs} from "react-google-maps";
import {POS_KEY} from "../constants";
import AroundMarker from "./AroundMarker";
class NormalAroundMap extends Component {
    render() {
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        return (
            <GoogleMap ref={this.getMapRef}
                defaultZoom={9}
                defaultCenter={{ lat: lat, lng: lon}}
                onDragEnd={this.reloadMarker}
                onZoomChanged={this.reloadMarker}>
                {this.props.posts.map((post) => <AroundMarker post={post} key={post.url} />)}
            </GoogleMap>
        );
    }

    getMapRef = (mapInstance) => {
        this.map = mapInstance;
        window.map = mapInstance;
    }

    reloadMarker = () => {
        const center = this.getCenter();
        const radius = this.getRadius();
        //send to home component
        this.props.loadNearbyPosts(center, radius);
    }
    getCenter = () => {
        const center = this.map.getCenter();
        return {lat: center.lat(), lon: center.lng()};
    }
    getRadius = () => {
        const center = this.map.getCenter();
        const bound = this.map.getBounds();
        if(center && bound) {
            const ne = bound.getNorthEast();
            const right = new window.google.maps.LatLng(center.lat(), ne.lng());
            return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }
}
const AroundMap =withScriptjs(withGoogleMap(NormalAroundMap));

export default AroundMap;