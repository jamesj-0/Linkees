const albumId = "2598468941";
const size = "large";
const backGroundColor = 'ffffff';
const linkColor = '0687f5';
const artworkSize = 'small';

function Bandcamp(){
    const src = `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=${size}/bgcol=${backGroundColor}/linkcol=${linkColor}${size === "large" ? `/artwork=${artworkSize}` :"" }/transparent=true/`;
    return <iframe style={{border: '0', width: '100%', height: size === 'large' ? '274px': "42px"}} src={src}/>
}
export default Bandcamp;