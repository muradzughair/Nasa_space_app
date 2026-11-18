const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/drivemode-DPM-dv4F.js","assets/index-w2eEpDnc.js","assets/index-Begb54s7.css"])))=>i.map(i=>d[i]);
import{O as e,b as t,c as n,l as r,s as i,u as a,x as o,y as s}from"./index-w2eEpDnc.js";var c={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},l={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},u=`attached`,d=1e3,f=1001,p=1002,m=1003,h=1004,g=1005,_=1006,v=1007,y=1008,b=1009,x=1014,S=1015,C=1016,w=1020,T=1023,E=1026,D=1027,O=1030,k=2300,A=2301,j=2302,ee=2400,M=2401,N=2402,te=2500,ne=3e3,re=3001,ie=3200,ae=3201,oe=`srgb`,se=`srgb-linear`,ce=`display-p3`,le=`display-p3-linear`,ue=`linear`,de=`srgb`,fe=`rec709`,pe=7680,me=35044,he=1035,ge=2e3,_e=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let n=this._listeners[e];if(n!==void 0){let e=n.indexOf(t);e!==-1&&n.splice(e,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let n=t.slice(0);for(let t=0,r=n.length;t<r;t++)n[t].call(this,e);e.target=null}}},P=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),ve=1234567,F=Math.PI/180,I=180/Math.PI;function L(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(P[e&255]+P[e>>8&255]+P[e>>16&255]+P[e>>24&255]+`-`+P[t&255]+P[t>>8&255]+`-`+P[t>>16&15|64]+P[t>>24&255]+`-`+P[n&63|128]+P[n>>8&255]+`-`+P[n>>16&255]+P[n>>24&255]+P[r&255]+P[r>>8&255]+P[r>>16&255]+P[r>>24&255]).toLowerCase()}function R(e,t,n){return Math.max(t,Math.min(n,e))}function ye(e,t){return(e%t+t)%t}function be(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function xe(e,t,n){return e===t?0:(n-e)/(t-e)}function Se(e,t,n){return(1-n)*e+n*t}function Ce(e,t,n,r){return Se(e,t,1-Math.exp(-n*r))}function we(e,t=1){return t-Math.abs(ye(e,t*2)-t)}function Te(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function Ee(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function De(e,t){return e+Math.floor(Math.random()*(t-e+1))}function Oe(e,t){return e+Math.random()*(t-e)}function ke(e){return e*(.5-Math.random())}function Ae(e){e!==void 0&&(ve=e);let t=ve+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function je(e){return e*F}function Me(e){return e*I}function Ne(e){return!(e&e-1)&&e!==0}function Pe(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Fe(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Ie(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:console.warn(`THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Le(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`Invalid component type.`)}}function z(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`Invalid component type.`)}}var Re={DEG2RAD:F,RAD2DEG:I,generateUUID:L,clamp:R,euclideanModulo:ye,mapLinear:be,inverseLerp:xe,lerp:Se,damp:Ce,pingpong:we,smoothstep:Te,smootherstep:Ee,randInt:De,randFloat:Oe,randFloatSpread:ke,seededRandom:Ae,degToRad:je,radToDeg:Me,isPowerOfTwo:Ne,ceilPowerOfTwo:Pe,floorPowerOfTwo:Fe,setQuaternionFromProperEuler:Ie,normalize:z,denormalize:Le},B=class e{constructor(t=0,n=0){e.prototype.isVector2=!0,this.x=t,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(R(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},V=class e{constructor(t,n,r,i,a,o,s,c,l){e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,n,r,i,a,o,s,c,l)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(ze.makeScale(e,t)),this}rotate(e){return this.premultiply(ze.makeRotation(-e)),this}translate(e,t){return this.premultiply(ze.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},ze=new V;function Be(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Ve(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function He(){let e=Ve(`canvas`);return e.style.display=`block`,e}var Ue={};function We(e){e in Ue||(Ue[e]=!0,console.warn(e))}var Ge=new V().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ke=new V().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),qe={[se]:{transfer:ue,primaries:fe,toReference:e=>e,fromReference:e=>e},[oe]:{transfer:de,primaries:fe,toReference:e=>e.convertSRGBToLinear(),fromReference:e=>e.convertLinearToSRGB()},[le]:{transfer:ue,primaries:`p3`,toReference:e=>e.applyMatrix3(Ke),fromReference:e=>e.applyMatrix3(Ge)},[ce]:{transfer:de,primaries:`p3`,toReference:e=>e.convertSRGBToLinear().applyMatrix3(Ke),fromReference:e=>e.applyMatrix3(Ge).convertLinearToSRGB()}},Je=new Set([se,le]),Ye={enabled:!0,_workingColorSpace:se,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(e){if(!Je.has(e))throw Error(`Unsupported working color space, "${e}".`);this._workingColorSpace=e},convert:function(e,t,n){if(this.enabled===!1||t===n||!t||!n)return e;let r=qe[t].toReference,i=qe[n].fromReference;return i(r(e))},fromWorkingColorSpace:function(e,t){return this.convert(e,this._workingColorSpace,t)},toWorkingColorSpace:function(e,t){return this.convert(e,t,this._workingColorSpace)},getPrimaries:function(e){return qe[e].primaries},getTransfer:function(e){return e===``?ue:qe[e].transfer}};function Xe(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Ze(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Qe,$e=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Qe===void 0&&(Qe=Ve(`canvas`)),Qe.width=e.width,Qe.height=e.height;let n=Qe.getContext(`2d`);e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Qe}return t.width>2048||t.height>2048?(console.warn(`THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons`,e),t.toDataURL(`image/jpeg`,.6)):t.toDataURL(`image/png`)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Ve(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Xe(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Xe(t[e]/255)*255):t[e]=Xe(t[e]);return{data:t,width:e.width,height:e.height}}return console.warn(`THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},et=0,tt=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:et++}),this.uuid=L(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(nt(r[t].image)):e.push(nt(r[t]))}else e=nt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function nt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?$e.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn(`THREE.Texture: Unable to serialize Texture.`),{})}var rt=0,it=class e extends _e{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=f,i=f,a=_,o=y,s=T,c=b,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rt++}),this.uuid=L(),this.name=``,this.source=new tt(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new B(0,0),this.repeat=new B(1,1),this.center=new B(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new V,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u==`string`?this.colorSpace=u:(We(`THREE.Texture: Property .encoding has been replaced by .colorSpace.`),this.colorSpace=u===3001?oe:``),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case d:e.x-=Math.floor(e.x);break;case f:e.x=e.x<0?0:1;break;case p:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case d:e.y-=Math.floor(e.y);break;case f:e.y=e.y<0?0:1;break;case p:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return We(`THREE.Texture: Property .encoding has been replaced by .colorSpace.`),this.colorSpace===`srgb`?re:ne}set encoding(e){We(`THREE.Texture: Property .encoding has been replaced by .colorSpace.`),this.colorSpace=e===3001?oe:``}};it.DEFAULT_IMAGE=null,it.DEFAULT_MAPPING=300,it.DEFAULT_ANISOTROPY=1;var at=class e{constructor(t=0,n=0,r=0,i=1){e.prototype.isVector4=!0,this.x=t,this.y=n,this.z=r,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ot=class extends _e{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new at(0,0,e,t),this.scissorTest=!1,this.viewport=new at(0,0,e,t);let r={width:e,height:t,depth:1};n.encoding!==void 0&&(We(`THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace.`),n.colorSpace=n.encoding===3001?oe:``),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:_,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new it(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new tt(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:`dispose`})}},st=class extends ot{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ct=class extends it{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=m,this.minFilter=m,this.wrapR=f,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},lt=class extends it{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=m,this.minFilter=m,this.wrapR=f,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ut=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(o===0)e[t+0]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u;else if(o===1)e[t+0]=d,e[t+1]=f,e[t+2]=p,e[t+3]=m;else{if(u!==m||s!==d||c!==f||l!==p){let e=1-o,t=s*d+c*f+l*p+u*m,n=t>=0?1:-1,r=1-t*t;if(r>2**-52){let i=Math.sqrt(r),a=Math.atan2(i,t*n);e=Math.sin(e*a)/i,o=Math.sin(o*a)/i}let i=o*n;if(s=s*e+d*i,c=c*e+f*i,l=l*e+p*i,u=u*e+m*i,e===1-o){let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:console.warn(`THREE.Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<2**-52?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(R(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,r=this._y,i=this._z,a=this._w,o=a*e._w+n*e._x+r*e._y+i*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=i,this;let s=1-o*o;if(s<=2**-52){let e=1-t;return this._w=e*a+t*this._w,this._x=e*n+t*this._x,this._y=e*r+t*this._y,this._z=e*i+t*this._z,this.normalize(),this}let c=Math.sqrt(s),l=Math.atan2(c,o),u=Math.sin((1-t)*l)/c,d=Math.sin(t*l)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=i*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),r=2*Math.PI*Math.random(),i=2*Math.PI*Math.random();return this.set(t*Math.cos(r),n*Math.sin(i),n*Math.cos(i),t*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},H=class e{constructor(t=0,n=0,r=0){e.prototype.isVector3=!0,this.x=t,this.y=n,this.z=r}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ft.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ft.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return dt.copy(this).projectOnVector(e),this.sub(dt)}reflect(e){return this.sub(dt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(R(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},dt=new H,ft=new ut,pt=class{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ht.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ht.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ht.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,ht):ht.fromBufferAttribute(r,t),ht.applyMatrix4(e.matrixWorld),this.expandByPoint(ht);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),gt.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),gt.copy(e.boundingBox)),gt.applyMatrix4(e.matrixWorld),this.union(gt)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,ht),ht.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ct),wt.subVectors(this.max,Ct),_t.subVectors(e.a,Ct),vt.subVectors(e.b,Ct),yt.subVectors(e.c,Ct),bt.subVectors(vt,_t),xt.subVectors(yt,vt),St.subVectors(_t,yt);let t=[0,-bt.z,bt.y,0,-xt.z,xt.y,0,-St.z,St.y,bt.z,0,-bt.x,xt.z,0,-xt.x,St.z,0,-St.x,-bt.y,bt.x,0,-xt.y,xt.x,0,-St.y,St.x,0];return!Dt(t,_t,vt,yt,wt)||(t=[1,0,0,0,1,0,0,0,1],!Dt(t,_t,vt,yt,wt))?!1:(Tt.crossVectors(bt,xt),t=[Tt.x,Tt.y,Tt.z],Dt(t,_t,vt,yt,wt))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ht).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ht).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(mt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mt)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},mt=[new H,new H,new H,new H,new H,new H,new H,new H],ht=new H,gt=new pt,_t=new H,vt=new H,yt=new H,bt=new H,xt=new H,St=new H,Ct=new H,wt=new H,Tt=new H,Et=new H;function Dt(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Et.fromArray(e,a);let o=i.x*Math.abs(Et.x)+i.y*Math.abs(Et.y)+i.z*Math.abs(Et.z),s=t.dot(Et),c=n.dot(Et),l=r.dot(Et);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Ot=new pt,kt=new H,At=new H,jt=class{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Ot.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;kt.subVectors(e,this.center);let t=kt.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(kt,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(At.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(kt.copy(e.center).add(At)),this.expandByPoint(kt.copy(e.center).sub(At))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Mt=new H,Nt=new H,Pt=new H,Ft=new H,It=new H,Lt=new H,Rt=new H,zt=class{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Mt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mt.copy(this.origin).addScaledVector(this.direction,t),Mt.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Nt.copy(e).add(t).multiplyScalar(.5),Pt.copy(t).sub(e).normalize(),Ft.copy(this.origin).sub(Nt);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Pt),o=Ft.dot(this.direction),s=-Ft.dot(Pt),c=Ft.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Nt).addScaledVector(Pt,d),f}intersectSphere(e,t){Mt.subVectors(e.center,this.origin);let n=Mt.dot(this.direction),r=Mt.dot(Mt)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Mt)!==null}intersectTriangle(e,t,n,r,i){It.subVectors(t,e),Lt.subVectors(n,e),Rt.crossVectors(It,Lt);let a=this.direction.dot(Rt),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ft.subVectors(this.origin,e);let s=o*this.direction.dot(Lt.crossVectors(Ft,Lt));if(s<0)return null;let c=o*this.direction.dot(It.cross(Ft));if(c<0||s+c>a)return null;let l=-o*Ft.dot(Rt);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},U=class e{constructor(t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g){e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/Bt.setFromMatrixColumn(e,0).length(),i=1/Bt.setFromMatrixColumn(e,1).length(),a=1/Bt.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ht,e,Ut)}lookAt(e,t,n){let r=this.elements;return Kt.subVectors(e,t),Kt.lengthSq()===0&&(Kt.z=1),Kt.normalize(),Wt.crossVectors(n,Kt),Wt.lengthSq()===0&&(Math.abs(n.z)===1?Kt.x+=1e-4:Kt.z+=1e-4,Kt.normalize(),Wt.crossVectors(n,Kt)),Wt.normalize(),Gt.crossVectors(Kt,Wt),r[0]=Wt.x,r[4]=Gt.x,r[8]=Kt.x,r[1]=Wt.y,r[5]=Gt.y,r[9]=Kt.y,r[2]=Wt.z,r[6]=Gt.z,r[10]=Kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],ee=r[14],M=r[3],N=r[7],te=r[11],ne=r[15];return i[0]=a*x+o*T+s*k+c*M,i[4]=a*S+o*E+s*A+c*N,i[8]=a*C+o*D+s*j+c*te,i[12]=a*w+o*O+s*ee+c*ne,i[1]=l*x+u*T+d*k+f*M,i[5]=l*S+u*E+d*A+f*N,i[9]=l*C+u*D+d*j+f*te,i[13]=l*w+u*O+d*ee+f*ne,i[2]=p*x+m*T+h*k+g*M,i[6]=p*S+m*E+h*A+g*N,i[10]=p*C+m*D+h*j+g*te,i[14]=p*w+m*O+h*ee+g*ne,i[3]=_*x+v*T+y*k+b*M,i[7]=_*S+v*E+y*A+b*N,i[11]=_*C+v*D+y*j+b*te,i[15]=_*w+v*O+y*ee+b*ne,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15];return p*(+i*s*u-r*c*u-i*o*d+n*c*d+r*o*f-n*s*f)+m*(+t*s*f-t*c*d+i*a*d-r*a*f+r*c*l-i*s*l)+h*(+t*c*u-t*o*f-i*a*u+n*a*f+i*o*l-n*c*l)+g*(-r*o*l-t*s*u+t*o*d+r*a*u-n*a*d+n*s*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=u*h*c-m*d*c+m*s*f-o*h*f-u*s*g+o*d*g,v=p*d*c-l*h*c-p*s*f+a*h*f+l*s*g-a*d*g,y=l*m*c-p*u*c+p*o*f-a*m*f-l*o*g+a*u*g,b=p*u*s-l*m*s-p*o*d+a*m*d+l*o*h-a*u*h,x=t*_+n*v+r*y+i*b;if(x===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/x;return e[0]=_*S,e[1]=(m*d*i-u*h*i-m*r*f+n*h*f+u*r*g-n*d*g)*S,e[2]=(o*h*i-m*s*i+m*r*c-n*h*c-o*r*g+n*s*g)*S,e[3]=(u*s*i-o*d*i-u*r*c+n*d*c+o*r*f-n*s*f)*S,e[4]=v*S,e[5]=(l*h*i-p*d*i+p*r*f-t*h*f-l*r*g+t*d*g)*S,e[6]=(p*s*i-a*h*i-p*r*c+t*h*c+a*r*g-t*s*g)*S,e[7]=(a*d*i-l*s*i+l*r*c-t*d*c-a*r*f+t*s*f)*S,e[8]=y*S,e[9]=(p*u*i-l*m*i-p*n*f+t*m*f+l*n*g-t*u*g)*S,e[10]=(a*m*i-p*o*i+p*n*c-t*m*c-a*n*g+t*o*g)*S,e[11]=(l*o*i-a*u*i-l*n*c+t*u*c+a*n*f-t*o*f)*S,e[12]=b*S,e[13]=(l*m*r-p*u*r+p*n*d-t*m*d-l*n*h+t*u*h)*S,e[14]=(p*o*r-a*m*r-p*n*s+t*m*s+a*n*h-t*o*h)*S,e[15]=(a*u*r-l*o*r+l*n*s-t*u*s-a*n*d+t*o*d)*S,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,i=Bt.set(r[0],r[1],r[2]).length(),a=Bt.set(r[4],r[5],r[6]).length(),o=Bt.set(r[8],r[9],r[10]).length();this.determinant()<0&&(i=-i),e.x=r[12],e.y=r[13],e.z=r[14],Vt.copy(this);let s=1/i,c=1/a,l=1/o;return Vt.elements[0]*=s,Vt.elements[1]*=s,Vt.elements[2]*=s,Vt.elements[4]*=c,Vt.elements[5]*=c,Vt.elements[6]*=c,Vt.elements[8]*=l,Vt.elements[9]*=l,Vt.elements[10]*=l,t.setFromRotationMatrix(Vt),n.x=i,n.y=a,n.z=o,this}makePerspective(e,t,n,r,i,a,o=ge){let s=this.elements,c=2*i/(t-e),l=2*i/(n-r),u=(t+e)/(t-e),d=(n+r)/(n-r),f,p;if(o===2e3)f=-(a+i)/(a-i),p=-2*a*i/(a-i);else if(o===2001)f=-a/(a-i),p=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return s[0]=c,s[4]=0,s[8]=u,s[12]=0,s[1]=0,s[5]=l,s[9]=d,s[13]=0,s[2]=0,s[6]=0,s[10]=f,s[14]=p,s[3]=0,s[7]=0,s[11]=-1,s[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=ge){let s=this.elements,c=1/(t-e),l=1/(n-r),u=1/(a-i),d=(t+e)*c,f=(n+r)*l,p,m;if(o===2e3)p=(a+i)*u,m=-2*u;else if(o===2001)p=i*u,m=-1*u;else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return s[0]=2*c,s[4]=0,s[8]=0,s[12]=-d,s[1]=0,s[5]=2*l,s[9]=0,s[13]=-f,s[2]=0,s[6]=0,s[10]=m,s[14]=-p,s[3]=0,s[7]=0,s[11]=0,s[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Bt=new H,Vt=new U,Ht=new H(0,0,0),Ut=new H(1,1,1),Wt=new H,Gt=new H,Kt=new H,qt=new U,Jt=new ut,Yt=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(R(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-R(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(R(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-R(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(R(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-R(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:console.warn(`THREE.Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return qt.makeRotationFromQuaternion(e),this.setFromRotationMatrix(qt,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Jt.setFromEuler(this),this.setFromQuaternion(Jt,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Yt.DEFAULT_ORDER=`XYZ`;var Xt=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Zt=0,Qt=new H,$t=new ut,en=new U,tn=new H,nn=new H,rn=new H,an=new ut,on=new H(1,0,0),sn=new H(0,1,0),cn=new H(0,0,1),ln={type:`added`},un={type:`removed`},dn=class e extends _e{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zt++}),this.uuid=L(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new H,n=new Yt,r=new ut,i=new H(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new U},normalMatrix:{value:new V}}),this.matrix=new U,this.matrixWorld=new U,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Xt,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return $t.setFromAxisAngle(e,t),this.quaternion.multiply($t),this}rotateOnWorldAxis(e,t){return $t.setFromAxisAngle(e,t),this.quaternion.premultiply($t),this}rotateX(e){return this.rotateOnAxis(on,e)}rotateY(e){return this.rotateOnAxis(sn,e)}rotateZ(e){return this.rotateOnAxis(cn,e)}translateOnAxis(e,t){return Qt.copy(e).applyQuaternion(this.quaternion),this.position.add(Qt.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(on,e)}translateY(e){return this.translateOnAxis(sn,e)}translateZ(e){return this.translateOnAxis(cn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(en.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?tn.copy(e):tn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),nn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?en.lookAt(nn,tn,this.up):en.lookAt(tn,nn,this.up),this.quaternion.setFromRotationMatrix(en),r&&(en.extractRotation(r.matrixWorld),$t.setFromRotationMatrix(en),this.quaternion.premultiply($t.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(console.error(`THREE.Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(ln)):console.error(`THREE.Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(un)),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),en.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),en.multiply(e.parent.matrixWorld)),e.applyMatrix4(en),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nn,e,rn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nn,an,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++){let r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){let e=this.children;for(let t=0,n=e.length;t<n;t++){let n=e[t];n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!1,!0)}}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(e=>({boxInitialized:e.boxInitialized,boxMin:e.box.min.toArray(),boxMax:e.box.max.toArray(),sphereInitialized:e.sphereInitialized,sphereRadius:e.sphere.radius,sphereCenter:e.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};dn.DEFAULT_UP=new H(0,1,0),dn.DEFAULT_MATRIX_AUTO_UPDATE=!0,dn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var fn=new H,pn=new H,mn=new H,hn=new H,gn=new H,_n=new H,vn=new H,yn=new H,bn=new H,xn=new H,Sn=!1,Cn=class e{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),fn.subVectors(e,t),r.cross(fn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){fn.subVectors(r,t),pn.subVectors(n,t),mn.subVectors(e,t);let a=fn.dot(fn),o=fn.dot(pn),s=fn.dot(mn),c=pn.dot(pn),l=pn.dot(mn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,hn)!==null&&hn.x>=0&&hn.y>=0&&hn.x+hn.y<=1}static getUV(e,t,n,r,i,a,o,s){return Sn===!1&&(console.warn(`THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation().`),Sn=!0),this.getInterpolation(e,t,n,r,i,a,o,s)}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,hn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,hn.x),s.addScaledVector(a,hn.y),s.addScaledVector(o,hn.z),s)}static isFrontFacing(e,t,n,r){return fn.subVectors(n,t),pn.subVectors(e,t),fn.cross(pn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return fn.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),fn.cross(pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getUV(t,n,r,i,a){return Sn===!1&&(console.warn(`THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation().`),Sn=!0),e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;gn.subVectors(r,n),_n.subVectors(i,n),yn.subVectors(e,n);let s=gn.dot(yn),c=_n.dot(yn);if(s<=0&&c<=0)return t.copy(n);bn.subVectors(e,r);let l=gn.dot(bn),u=_n.dot(bn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(gn,a);xn.subVectors(e,i);let f=gn.dot(xn),p=_n.dot(xn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(_n,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return vn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(vn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(gn,a).addScaledVector(_n,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},wn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Tn={h:0,s:0,l:0},En={h:0,s:0,l:0};function Dn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var W=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=oe){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ye.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=Ye.workingColorSpace){if(e=ye(e,1),t=R(t,0,1),n=R(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Dn(i,r,e+1/3),this.g=Dn(i,r,e),this.b=Dn(i,r,e-1/3)}return Ye.toWorkingColorSpace(this,r),this}setStyle(e,t=oe){function n(t){t!==void 0&&parseFloat(t)<1&&console.warn(`THREE.Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:console.warn(`THREE.Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);console.warn(`THREE.Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=oe){let n=wn[e.toLowerCase()];return n===void 0?console.warn(`THREE.Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xe(e.r),this.g=Xe(e.g),this.b=Xe(e.b),this}copyLinearToSRGB(e){return this.r=Ze(e.r),this.g=Ze(e.g),this.b=Ze(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=oe){return Ye.fromWorkingColorSpace(On.copy(this),e),Math.round(R(On.r*255,0,255))*65536+Math.round(R(On.g*255,0,255))*256+Math.round(R(On.b*255,0,255))}getHexString(e=oe){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.fromWorkingColorSpace(On.copy(this),t);let n=On.r,r=On.g,i=On.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Ye.workingColorSpace){return Ye.fromWorkingColorSpace(On.copy(this),t),e.r=On.r,e.g=On.g,e.b=On.b,e}getStyle(e=oe){Ye.fromWorkingColorSpace(On.copy(this),e);let t=On.r,n=On.g,r=On.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Tn),this.setHSL(Tn.h+e,Tn.s+t,Tn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Tn),e.getHSL(En);let n=Se(Tn.h,En.h,t),r=Se(Tn.s,En.s,t),i=Se(Tn.l,En.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},On=new W;W.NAMES=wn;var kn=0,An=class extends _e{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kn++}),this.uuid=L(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new W(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pe,this.stencilZFail=pe,this.stencilZPass=pe,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},jn=class extends An{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new W(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Mn=new H,Nn=new B,Pn=class{constructor(e,t,n=!1){if(Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=me,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=S,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn(`THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead.`),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Nn.fromBufferAttribute(this,t),Nn.applyMatrix3(e),this.setXY(t,Nn.x,Nn.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Mn.fromBufferAttribute(this,t),Mn.applyMatrix3(e),this.setXYZ(t,Mn.x,Mn.y,Mn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Mn.fromBufferAttribute(this,t),Mn.applyMatrix4(e),this.setXYZ(t,Mn.x,Mn.y,Mn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Mn.fromBufferAttribute(this,t),Mn.applyNormalMatrix(e),this.setXYZ(t,Mn.x,Mn.y,Mn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Mn.fromBufferAttribute(this,t),Mn.transformDirection(e),this.setXYZ(t,Mn.x,Mn.y,Mn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Le(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=z(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Le(t,this.array)),t}setX(e,t){return this.normalized&&(t=z(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Le(t,this.array)),t}setY(e,t){return this.normalized&&(t=z(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Le(t,this.array)),t}setZ(e,t){return this.normalized&&(t=z(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Le(t,this.array)),t}setW(e,t){return this.normalized&&(t=z(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=z(t,this.array),n=z(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=z(t,this.array),n=z(n,this.array),r=z(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=z(t,this.array),n=z(n,this.array),r=z(r,this.array),i=z(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}},Fn=class extends Pn{constructor(e,t,n){super(new Uint16Array(e),t,n)}},In=class extends Pn{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Ln=class extends Pn{constructor(e,t,n){super(new Float32Array(e),t,n)}},Rn=0,zn=new U,Bn=new dn,Vn=new H,Hn=new pt,Un=new pt,Wn=new H,Gn=class e extends _e{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Rn++}),this.uuid=L(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Be(e)?In:Fn)(e,1):e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new V().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return zn.makeRotationFromQuaternion(e),this.applyMatrix4(zn),this}rotateX(e){return zn.makeRotationX(e),this.applyMatrix4(zn),this}rotateY(e){return zn.makeRotationY(e),this.applyMatrix4(zn),this}rotateZ(e){return zn.makeRotationZ(e),this.applyMatrix4(zn),this}translate(e,t,n){return zn.makeTranslation(e,t,n),this.applyMatrix4(zn),this}scale(e,t,n){return zn.makeScale(e,t,n),this.applyMatrix4(zn),this}lookAt(e){return Bn.lookAt(e),Bn.updateMatrix(),this.applyMatrix4(Bn.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vn).negate(),this.translate(Vn.x,Vn.y,Vn.z),this}setFromPoints(e){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute(`position`,new Ln(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)console.error(`THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".`,this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Hn.setFromBufferAttribute(n),this.morphTargetsRelative?(Wn.addVectors(this.boundingBox.min,Hn.min),this.boundingBox.expandByPoint(Wn),Wn.addVectors(this.boundingBox.max,Hn.max),this.boundingBox.expandByPoint(Wn)):(this.boundingBox.expandByPoint(Hn.min),this.boundingBox.expandByPoint(Hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error(`THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new jt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)console.error(`THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".`,this),this.boundingSphere.set(new H,1/0);else if(e){let n=this.boundingSphere.center;if(Hn.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Un.setFromBufferAttribute(n),this.morphTargetsRelative?(Wn.addVectors(Hn.min,Un.min),Hn.expandByPoint(Wn),Wn.addVectors(Hn.max,Un.max),Hn.expandByPoint(Wn)):(Hn.expandByPoint(Un.min),Hn.expandByPoint(Un.max))}Hn.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Wn.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Wn));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Wn.fromBufferAttribute(a,t),o&&(Vn.fromBufferAttribute(e,t),Wn.add(Vn)),r=Math.max(r,n.distanceToSquared(Wn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error(`THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=e.array,r=t.position.array,i=t.normal.array,a=t.uv.array,o=r.length/3;this.hasAttribute(`tangent`)===!1&&this.setAttribute(`tangent`,new Pn(new Float32Array(4*o),4));let s=this.getAttribute(`tangent`).array,c=[],l=[];for(let e=0;e<o;e++)c[e]=new H,l[e]=new H;let u=new H,d=new H,f=new H,p=new B,m=new B,h=new B,g=new H,_=new H;function v(e,t,n){u.fromArray(r,e*3),d.fromArray(r,t*3),f.fromArray(r,n*3),p.fromArray(a,e*2),m.fromArray(a,t*2),h.fromArray(a,n*2),d.sub(u),f.sub(u),m.sub(p),h.sub(p);let i=1/(m.x*h.y-h.x*m.y);isFinite(i)&&(g.copy(d).multiplyScalar(h.y).addScaledVector(f,-m.y).multiplyScalar(i),_.copy(f).multiplyScalar(m.x).addScaledVector(d,-h.x).multiplyScalar(i),c[e].add(g),c[t].add(g),c[n].add(g),l[e].add(_),l[t].add(_),l[n].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:n.length}]);for(let e=0,t=y.length;e<t;++e){let t=y[e],r=t.start,i=t.count;for(let e=r,t=r+i;e<t;e+=3)v(n[e+0],n[e+1],n[e+2])}let b=new H,x=new H,S=new H,C=new H;function w(e){S.fromArray(i,e*3),C.copy(S);let t=c[e];b.copy(t),b.sub(S.multiplyScalar(S.dot(t))).normalize(),x.crossVectors(C,t);let n=x.dot(l[e])<0?-1:1;s[e*4]=b.x,s[e*4+1]=b.y,s[e*4+2]=b.z,s[e*4+3]=n}for(let e=0,t=y.length;e<t;++e){let t=y[e],r=t.start,i=t.count;for(let e=r,t=r+i;e<t;e+=3)w(n[e+0]),w(n[e+1]),w(n[e+2])}}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0)n=new Pn(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new H,i=new H,a=new H,o=new H,s=new H,c=new H,l=new H,u=new H;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Wn.fromBufferAttribute(e,t),Wn.normalize(),e.setXYZ(t,Wn.x,Wn.y,Wn.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Pn(a,r,i)}if(this.index===null)return console.warn(`THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.6,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:`dispose`})}},Kn=new U,qn=new zt,Jn=new jt,Yn=new H,Xn=new H,Zn=new H,Qn=new H,$n=new H,er=new H,tr=new B,nr=new B,rr=new B,ir=new H,ar=new H,or=new H,sr=new H,cr=new H,lr=class extends dn{constructor(e=new Gn,t=new jn){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){er.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&($n.fromBufferAttribute(s,e),a?er.addScaledVector($n,r):er.addScaledVector($n.sub(t),r))}t.add(er)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Jn.copy(n.boundingSphere),Jn.applyMatrix4(i),qn.copy(e.ray).recast(e.near),Jn.containsPoint(qn.origin)===!1&&(qn.intersectSphere(Jn,Yn)===null||qn.origin.distanceToSquared(Yn)>(e.far-e.near)**2)||(Kn.copy(i).invert(),qn.copy(e.ray).applyMatrix4(Kn),(n.boundingBox===null||qn.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,qn)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=dr(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=dr(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=dr(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=dr(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function ur(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;cr.copy(s),cr.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(cr);return l<n.near||l>n.far?null:{distance:l,point:cr.clone(),object:e}}function dr(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Xn),e.getVertexPosition(c,Zn),e.getVertexPosition(l,Qn);let u=ur(e,t,n,r,Xn,Zn,Qn,sr);if(u){i&&(tr.fromBufferAttribute(i,s),nr.fromBufferAttribute(i,c),rr.fromBufferAttribute(i,l),u.uv=Cn.getInterpolation(sr,Xn,Zn,Qn,tr,nr,rr,new B)),a&&(tr.fromBufferAttribute(a,s),nr.fromBufferAttribute(a,c),rr.fromBufferAttribute(a,l),u.uv1=Cn.getInterpolation(sr,Xn,Zn,Qn,tr,nr,rr,new B),u.uv2=u.uv1),o&&(ir.fromBufferAttribute(o,s),ar.fromBufferAttribute(o,c),or.fromBufferAttribute(o,l),u.normal=Cn.getInterpolation(sr,Xn,Zn,Qn,ir,ar,or,new H),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let e={a:s,b:c,c:l,normal:new H,materialIndex:0};Cn.getNormal(Xn,Zn,Qn,e.normal),u.face=e}return u}var fr=class e extends Gn{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Ln(c,3)),this.setAttribute(`normal`,new Ln(l,3)),this.setAttribute(`uv`,new Ln(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new H;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function pr(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone():Array.isArray(i)?t[n][r]=i.slice():t[n][r]=i}}return t}function mr(e){let t={};for(let n=0;n<e.length;n++){let r=pr(e[n]);for(let e in r)t[e]=r[e]}return t}function hr(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function gr(e){return e.getRenderTarget()===null?e.outputColorSpace:Ye.workingColorSpace}var _r={clone:pr,merge:mr},vr=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,yr=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,br=class extends An{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=vr,this.fragmentShader=yr,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=pr(e.uniforms),this.uniformsGroups=hr(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},xr=class extends dn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new U,this.projectionMatrix=new U,this.projectionMatrixInverse=new U,this.coordinateSystem=ge}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Sr=class extends xr{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=I*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(F*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return I*2*Math.atan(Math.tan(F*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(F*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Cr=-90,wr=1,Tr=class extends dn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Sr(Cr,wr,e,t);r.layers=this.layers,this.add(r);let i=new Sr(Cr,wr,e,t);i.layers=this.layers,this.add(i);let a=new Sr(Cr,wr,e,t);a.layers=this.layers,this.add(a);let o=new Sr(Cr,wr,e,t);o.layers=this.layers,this.add(o);let s=new Sr(Cr,wr,e,t);s.layers=this.layers,this.add(s);let c=new Sr(Cr,wr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,i),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,s),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Er=class extends it{constructor(e,t,n,r,i,a,o,s,c,l){e=e===void 0?[]:e,t=t===void 0?301:t,super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Dr=class extends st{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];t.encoding!==void 0&&(We(`THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace.`),t.colorSpace=t.encoding===3001?oe:``),this.texture=new Er(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0&&t.generateMipmaps,this.texture.minFilter=t.minFilter===void 0?_:t.minFilter}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new fr(5,5,5),i=new br({name:`CubemapFromEquirect`,uniforms:pr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new lr(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=_),new Tr(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,r){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},Or=new H,kr=new H,Ar=new V,jr=class{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Or.subVectors(n,t).cross(kr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Or),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let i=-(e.start.dot(this.normal)+this.constant)/r;return i<0||i>1?null:t.copy(e.start).addScaledVector(n,i)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Ar.getNormalMatrix(e),r=this.coplanarPoint(Or).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Mr=new jt,Nr=new H,Pr=class{constructor(e=new jr,t=new jr,n=new jr,r=new jr,i=new jr,a=new jr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ge){let n=this.planes,r=e.elements,i=r[0],a=r[1],o=r[2],s=r[3],c=r[4],l=r[5],u=r[6],d=r[7],f=r[8],p=r[9],m=r[10],h=r[11],g=r[12],_=r[13],v=r[14],y=r[15];if(n[0].setComponents(s-i,d-c,h-f,y-g).normalize(),n[1].setComponents(s+i,d+c,h+f,y+g).normalize(),n[2].setComponents(s+a,d+l,h+p,y+_).normalize(),n[3].setComponents(s-a,d-l,h-p,y-_).normalize(),n[4].setComponents(s-o,d-u,h-m,y-v).normalize(),t===2e3)n[5].setComponents(s+o,d+u,h+m,y+v).normalize();else if(t===2001)n[5].setComponents(o,u,m,v).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Mr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Mr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Mr)}intersectsSprite(e){return Mr.center.set(0,0,0),Mr.radius=.7071067811865476,Mr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Mr)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Nr.x=r.normal.x>0?e.max.x:e.min.x,Nr.y=r.normal.y>0?e.max.y:e.min.y,Nr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Nr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Fr(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Ir(e,t){let n=t.isWebGL2,r=new WeakMap;function i(t,r){let i=t.array,a=t.usage,o=i.byteLength,s=e.createBuffer();e.bindBuffer(r,s),e.bufferData(r,i,a),t.onUploadCallback();let c;if(i instanceof Float32Array)c=e.FLOAT;else if(i instanceof Uint16Array){if(t.isFloat16BufferAttribute){if(n)c=e.HALF_FLOAT;else throw Error(`THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.`)}else c=e.UNSIGNED_SHORT}else if(i instanceof Int16Array)c=e.SHORT;else if(i instanceof Uint32Array)c=e.UNSIGNED_INT;else if(i instanceof Int32Array)c=e.INT;else if(i instanceof Int8Array)c=e.BYTE;else if(i instanceof Uint8Array)c=e.UNSIGNED_BYTE;else if(i instanceof Uint8ClampedArray)c=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+i);return{buffer:s,type:c,bytesPerElement:i.BYTES_PER_ELEMENT,version:t.version,size:o}}function a(t,r,i){let a=r.array,o=r._updateRange,s=r.updateRanges;if(e.bindBuffer(i,t),o.count===-1&&s.length===0&&e.bufferSubData(i,0,a),s.length!==0){for(let t=0,r=s.length;t<r;t++){let r=s[t];n?e.bufferSubData(i,r.start*a.BYTES_PER_ELEMENT,a,r.start,r.count):e.bufferSubData(i,r.start*a.BYTES_PER_ELEMENT,a.subarray(r.start,r.start+r.count))}r.clearUpdateRanges()}o.count!==-1&&(n?e.bufferSubData(i,o.offset*a.BYTES_PER_ELEMENT,a,o.offset,o.count):e.bufferSubData(i,o.offset*a.BYTES_PER_ELEMENT,a.subarray(o.offset,o.offset+o.count)),o.count=-1),r.onUploadCallback()}function o(e){return e.isInterleavedBufferAttribute&&(e=e.data),r.get(e)}function s(t){t.isInterleavedBufferAttribute&&(t=t.data);let n=r.get(t);n&&(e.deleteBuffer(n.buffer),r.delete(t))}function c(e,t){if(e.isGLBufferAttribute){let t=r.get(e);(!t||t.version<e.version)&&r.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}e.isInterleavedBufferAttribute&&(e=e.data);let n=r.get(e);if(n===void 0)r.set(e,i(e,t));else if(n.version<e.version){if(n.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);a(n.buffer,e,t),n.version=e.version}}return{get:o,remove:s,update:c}}var Lr=class e extends Gn{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Ln(p,3)),this.setAttribute(`normal`,new Ln(m,3)),this.setAttribute(`uv`,new Ln(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},G={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_fragment:`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},K={common:{diffuse:{value:new W(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new V},alphaMap:{value:null},alphaMapTransform:{value:new V},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new V}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new V}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new V}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new V},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new V},normalScale:{value:new B(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new V},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new V}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new V}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new V}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new W(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new W(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new V},alphaTest:{value:0},uvTransform:{value:new V}},sprite:{diffuse:{value:new W(16777215)},opacity:{value:1},center:{value:new B(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new V},alphaMap:{value:null},alphaMapTransform:{value:new V},alphaTest:{value:0}}},Rr={basic:{uniforms:mr([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.fog]),vertexShader:G.meshbasic_vert,fragmentShader:G.meshbasic_frag},lambert:{uniforms:mr([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new W(0)}}]),vertexShader:G.meshlambert_vert,fragmentShader:G.meshlambert_frag},phong:{uniforms:mr([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new W(0)},specular:{value:new W(1118481)},shininess:{value:30}}]),vertexShader:G.meshphong_vert,fragmentShader:G.meshphong_frag},standard:{uniforms:mr([K.common,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.roughnessmap,K.metalnessmap,K.fog,K.lights,{emissive:{value:new W(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:G.meshphysical_vert,fragmentShader:G.meshphysical_frag},toon:{uniforms:mr([K.common,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.gradientmap,K.fog,K.lights,{emissive:{value:new W(0)}}]),vertexShader:G.meshtoon_vert,fragmentShader:G.meshtoon_frag},matcap:{uniforms:mr([K.common,K.bumpmap,K.normalmap,K.displacementmap,K.fog,{matcap:{value:null}}]),vertexShader:G.meshmatcap_vert,fragmentShader:G.meshmatcap_frag},points:{uniforms:mr([K.points,K.fog]),vertexShader:G.points_vert,fragmentShader:G.points_frag},dashed:{uniforms:mr([K.common,K.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:G.linedashed_vert,fragmentShader:G.linedashed_frag},depth:{uniforms:mr([K.common,K.displacementmap]),vertexShader:G.depth_vert,fragmentShader:G.depth_frag},normal:{uniforms:mr([K.common,K.bumpmap,K.normalmap,K.displacementmap,{opacity:{value:1}}]),vertexShader:G.meshnormal_vert,fragmentShader:G.meshnormal_frag},sprite:{uniforms:mr([K.sprite,K.fog]),vertexShader:G.sprite_vert,fragmentShader:G.sprite_frag},background:{uniforms:{uvTransform:{value:new V},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:G.background_vert,fragmentShader:G.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:G.backgroundCube_vert,fragmentShader:G.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:G.cube_vert,fragmentShader:G.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:G.equirect_vert,fragmentShader:G.equirect_frag},distanceRGBA:{uniforms:mr([K.common,K.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:G.distanceRGBA_vert,fragmentShader:G.distanceRGBA_frag},shadow:{uniforms:mr([K.lights,K.fog,{color:{value:new W(0)},opacity:{value:1}}]),vertexShader:G.shadow_vert,fragmentShader:G.shadow_frag}};Rr.physical={uniforms:mr([Rr.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new V},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new V},clearcoatNormalScale:{value:new B(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new V},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new V},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new V},sheen:{value:0},sheenColor:{value:new W(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new V},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new V},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new V},transmissionSamplerSize:{value:new B},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new V},attenuationDistance:{value:0},attenuationColor:{value:new W(0)},specularColor:{value:new W(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new V},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new V},anisotropyVector:{value:new B},anisotropyMap:{value:null},anisotropyMapTransform:{value:new V}}]),vertexShader:G.meshphysical_vert,fragmentShader:G.meshphysical_frag};var zr={r:0,b:0,g:0};function Br(e,t,n,r,i,a,o){let s=new W(0),c=a===!0?0:1,l,u,d=null,f=0,p=null;function m(a,m){let g=!1,_=m.isScene===!0?m.background:null;_&&_.isTexture&&(_=(m.backgroundBlurriness>0?n:t).get(_)),_===null?h(s,c):_&&_.isColor&&(h(_,1),g=!0);let v=e.xr.getEnvironmentBlendMode();v===`additive`?r.buffers.color.setClear(0,0,0,1,o):v===`alpha-blend`&&r.buffers.color.setClear(0,0,0,0,o),(e.autoClear||g)&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),_&&(_.isCubeTexture||_.mapping===306)?(u===void 0&&(u=new lr(new fr(1,1,1),new br({name:`BackgroundCubeMaterial`,uniforms:pr(Rr.backgroundCube.uniforms),vertexShader:Rr.backgroundCube.vertexShader,fragmentShader:Rr.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute(`normal`),u.geometry.deleteAttribute(`uv`),u.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),u.material.uniforms.envMap.value=_,u.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=m.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,u.material.toneMapped=Ye.getTransfer(_.colorSpace)!==de,(d!==_||f!==_.version||p!==e.toneMapping)&&(u.material.needsUpdate=!0,d=_,f=_.version,p=e.toneMapping),u.layers.enableAll(),a.unshift(u,u.geometry,u.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new lr(new Lr(2,2),new br({name:`BackgroundMaterial`,uniforms:pr(Rr.background.uniforms),vertexShader:Rr.background.vertexShader,fragmentShader:Rr.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute(`normal`),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,l.material.toneMapped=Ye.getTransfer(_.colorSpace)!==de,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||f!==_.version||p!==e.toneMapping)&&(l.material.needsUpdate=!0,d=_,f=_.version,p=e.toneMapping),l.layers.enableAll(),a.unshift(l,l.geometry,l.material,0,0,null))}function h(t,n){t.getRGB(zr,gr(e)),r.buffers.color.setClear(zr.r,zr.g,zr.b,n,o)}return{getClearColor:function(){return s},setClearColor:function(e,t=1){s.set(e),c=t,h(s,c)},getClearAlpha:function(){return c},setClearAlpha:function(e){c=e,h(s,c)},render:m}}function Vr(e,t,n,r){let i=e.getParameter(e.MAX_VERTEX_ATTRIBS),a=r.isWebGL2?null:t.get(`OES_vertex_array_object`),o=r.isWebGL2||a!==null,s={},c=g(null),l=c,u=!1;function d(t,r,i,a,s){let c=!1;if(o){let e=h(a,i,r);l!==e&&(l=e,p(l.object)),c=_(t,a,i,s),c&&v(t,a,i,s)}else{let e=r.wireframe===!0;(l.geometry!==a.id||l.program!==i.id||l.wireframe!==e)&&(l.geometry=a.id,l.program=i.id,l.wireframe=e,c=!0)}s!==null&&n.update(s,e.ELEMENT_ARRAY_BUFFER),(c||u)&&(u=!1,w(t,r,i,a),s!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(s).buffer))}function f(){return r.isWebGL2?e.createVertexArray():a.createVertexArrayOES()}function p(t){return r.isWebGL2?e.bindVertexArray(t):a.bindVertexArrayOES(t)}function m(t){return r.isWebGL2?e.deleteVertexArray(t):a.deleteVertexArrayOES(t)}function h(e,t,n){let r=n.wireframe===!0,i=s[e.id];i===void 0&&(i={},s[e.id]=i);let a=i[t.id];a===void 0&&(a={},i[t.id]=a);let o=a[r];return o===void 0&&(o=g(f()),a[r]=o),o}function g(e){let t=[],n=[],r=[];for(let e=0;e<i;e++)t[e]=0,n[e]=0,r[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:n,attributeDivisors:r,object:e,attributes:{},index:null}}function _(e,t,n,r){let i=l.attributes,a=t.attributes,o=0,s=n.getAttributes();for(let t in s)if(s[t].location>=0){let n=i[t],r=a[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;o++}return l.attributesNum!==o||l.index!==r}function v(e,t,n,r){let i={},a=t.attributes,o=0,s=n.getAttributes();for(let t in s)if(s[t].location>=0){let n=a[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,o++}l.attributes=i,l.attributesNum=o,l.index=r}function y(){let e=l.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function b(e){x(e,0)}function x(n,i){let a=l.newAttributes,o=l.enabledAttributes,s=l.attributeDivisors;a[n]=1,o[n]===0&&(e.enableVertexAttribArray(n),o[n]=1),s[n]!==i&&((r.isWebGL2?e:t.get(`ANGLE_instanced_arrays`))[r.isWebGL2?`vertexAttribDivisor`:`vertexAttribDivisorANGLE`](n,i),s[n]=i)}function S(){let t=l.newAttributes,n=l.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function C(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function w(i,a,o,s){if(r.isWebGL2===!1&&(i.isInstancedMesh||s.isInstancedBufferGeometry)&&t.get(`ANGLE_instanced_arrays`)===null)return;y();let c=s.attributes,l=o.getAttributes(),u=a.defaultAttributeValues;for(let t in l){let a=l[t];if(a.location>=0){let o=c[t];if(o===void 0&&(t===`instanceMatrix`&&i.instanceMatrix&&(o=i.instanceMatrix),t===`instanceColor`&&i.instanceColor&&(o=i.instanceColor)),o!==void 0){let t=o.normalized,c=o.itemSize,l=n.get(o);if(l===void 0)continue;let u=l.buffer,d=l.type,f=l.bytesPerElement,p=r.isWebGL2===!0&&(d===e.INT||d===e.UNSIGNED_INT||o.gpuType===1013);if(o.isInterleavedBufferAttribute){let n=o.data,r=n.stride,l=o.offset;if(n.isInstancedInterleavedBuffer){for(let e=0;e<a.locationSize;e++)x(a.location+e,n.meshPerAttribute);i.isInstancedMesh!==!0&&s._maxInstanceCount===void 0&&(s._maxInstanceCount=n.meshPerAttribute*n.count)}else for(let e=0;e<a.locationSize;e++)b(a.location+e);e.bindBuffer(e.ARRAY_BUFFER,u);for(let e=0;e<a.locationSize;e++)C(a.location+e,c/a.locationSize,d,t,r*f,(l+c/a.locationSize*e)*f,p)}else{if(o.isInstancedBufferAttribute){for(let e=0;e<a.locationSize;e++)x(a.location+e,o.meshPerAttribute);i.isInstancedMesh!==!0&&s._maxInstanceCount===void 0&&(s._maxInstanceCount=o.meshPerAttribute*o.count)}else for(let e=0;e<a.locationSize;e++)b(a.location+e);e.bindBuffer(e.ARRAY_BUFFER,u);for(let e=0;e<a.locationSize;e++)C(a.location+e,c/a.locationSize,d,t,c*f,c/a.locationSize*e*f,p)}}else if(u!==void 0){let n=u[t];if(n!==void 0)switch(n.length){case 2:e.vertexAttrib2fv(a.location,n);break;case 3:e.vertexAttrib3fv(a.location,n);break;case 4:e.vertexAttrib4fv(a.location,n);break;default:e.vertexAttrib1fv(a.location,n)}}}}S()}function T(){O();for(let e in s){let t=s[e];for(let e in t){let n=t[e];for(let e in n)m(n[e].object),delete n[e];delete t[e]}delete s[e]}}function E(e){if(s[e.id]===void 0)return;let t=s[e.id];for(let e in t){let n=t[e];for(let e in n)m(n[e].object),delete n[e];delete t[e]}delete s[e.id]}function D(e){for(let t in s){let n=s[t];if(n[e.id]===void 0)continue;let r=n[e.id];for(let e in r)m(r[e].object),delete r[e];delete n[e.id]}}function O(){k(),u=!0,l!==c&&(l=c,p(l.object))}function k(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:d,reset:O,resetDefaultState:k,dispose:T,releaseStatesOfGeometry:E,releaseStatesOfProgram:D,initAttributes:y,enableAttribute:b,disableUnusedAttributes:S}}function Hr(e,t,n,r){let i=r.isWebGL2,a;function o(e){a=e}function s(t,r){e.drawArrays(a,t,r),n.update(r,a,1)}function c(r,o,s){if(s===0)return;let c,l;if(i)c=e,l=`drawArraysInstanced`;else if(c=t.get(`ANGLE_instanced_arrays`),l=`drawArraysInstancedANGLE`,c===null){console.error(`THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.`);return}c[l](a,r,o,s),n.update(o,a,s)}function l(e,r,i){if(i===0)return;let o=t.get(`WEBGL_multi_draw`);if(o===null)for(let t=0;t<i;t++)this.render(e[t],r[t]);else{o.multiDrawArraysWEBGL(a,e,0,r,0,i);let t=0;for(let e=0;e<i;e++)t+=r[e];n.update(t,a,1)}}this.setMode=o,this.render=s,this.renderInstances=c,this.renderMultiDraw=l}function Ur(e,t,n){let r;function i(){if(r!==void 0)return r;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);r=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let o=typeof WebGL2RenderingContext<`u`&&e.constructor.name===`WebGL2RenderingContext`,s=n.precision===void 0?`highp`:n.precision,c=a(s);c!==s&&(console.warn(`THREE.WebGLRenderer:`,s,`not supported, using`,c,`instead.`),s=c);let l=o||t.has(`WEBGL_draw_buffers`),u=n.logarithmicDepthBuffer===!0,d=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),f=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=e.getParameter(e.MAX_TEXTURE_SIZE),m=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),h=e.getParameter(e.MAX_VERTEX_ATTRIBS),g=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),_=e.getParameter(e.MAX_VARYING_VECTORS),v=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),y=f>0,b=o||t.has(`OES_texture_float`),x=y&&b,S=o?e.getParameter(e.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:i,getMaxPrecision:a,precision:s,logarithmicDepthBuffer:u,maxTextures:d,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:g,maxVaryings:_,maxFragmentUniforms:v,vertexTextures:y,floatFragmentTextures:b,floatVertexTextures:x,maxSamples:S}}function Wr(e){let t=this,n=null,r=0,i=!1,a=!1,o=new jr,s=new V,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}function Gr(e){let t=new WeakMap;function n(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function r(r){if(r&&r.isTexture){let a=r.mapping;if(a===303||a===304){if(t.has(r)){let e=t.get(r).texture;return n(e,r.mapping)}{let a=r.image;if(a&&a.height>0){let o=new Dr(a.height/2);return o.fromEquirectangularTexture(e,r),t.set(r,o),r.addEventListener(`dispose`,i),n(o.texture,r.mapping)}return null}}}return r}function i(e){let n=e.target;n.removeEventListener(`dispose`,i);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function a(){t=new WeakMap}return{get:r,dispose:a}}var Kr=class extends xr{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},qr=4,Jr=[.125,.215,.35,.446,.526,.582],Yr=20,Xr=new Kr,Zr=new W,Qr=null,$r=0,ei=0,ti=(1+Math.sqrt(5))/2,ni=1/ti,ri=[new H(1,1,1),new H(-1,1,1),new H(1,1,-1),new H(-1,1,-1),new H(0,ti,ni),new H(0,ti,-ni),new H(ni,0,ti),new H(-ni,0,ti),new H(ti,ni,0),new H(-ti,ni,0)],ii=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){Qr=this._renderer.getRenderTarget(),$r=this._renderer.getActiveCubeFace(),ei=this._renderer.getActiveMipmapLevel(),this._setSize(256);let i=this._allocateTargets();return i.depthBuffer=!0,this._sceneToCubeUV(e,n,r,i),t>0&&this._blur(i,0,0,t),this._applyPMREM(i),this._cleanup(i),i}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ui(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=li(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Qr,$r,ei),e.scissorTest=!1,si(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Qr=this._renderer.getRenderTarget(),$r=this._renderer.getActiveCubeFace(),ei=this._renderer.getActiveMipmapLevel();let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:_,minFilter:_,generateMipmaps:!1,type:C,format:T,colorSpace:se,depthBuffer:!1},r=oi(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=oi(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ai(r)),this._blurMaterial=ci(r,e,t)}return r}_compileMaterial(e){let t=new lr(this._lodPlanes[0],e);this._renderer.compile(t,Xr)}_sceneToCubeUV(e,t,n,r){let i=new Sr(90,1,t,n),a=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],s=this._renderer,c=s.autoClear,l=s.toneMapping;s.getClearColor(Zr),s.toneMapping=0,s.autoClear=!1;let u=new jn({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1}),d=new lr(new fr,u),f=!1,p=e.background;p?p.isColor&&(u.color.copy(p),e.background=null,f=!0):(u.color.copy(Zr),f=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(i.up.set(0,a[t],0),i.lookAt(o[t],0,0)):n===1?(i.up.set(0,0,a[t]),i.lookAt(0,o[t],0)):(i.up.set(0,a[t],0),i.lookAt(0,0,o[t]));let c=this._cubeSize;si(r,n*c,t>2?c:0,c,c),s.setRenderTarget(r),f&&s.render(d,i),s.render(e,i)}d.geometry.dispose(),d.material.dispose(),s.toneMapping=l,s.autoClear=c,e.background=p}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ui()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=li());let i=r?this._cubemapMaterial:this._equirectMaterial,a=new lr(this._lodPlanes[0],i),o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;si(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Xr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let t=1;t<this._lodPlanes.length;t++){let n=Math.sqrt(this._sigmas[t]*this._sigmas[t]-this._sigmas[t-1]*this._sigmas[t-1]),r=ri[(t-1)%ri.length];this._blur(e,t-1,t,n,r)}t.autoClear=n}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&console.error(`blur direction must be either latitudinal or longitudinal!`);let l=new lr(this._lodPlanes[r],c),u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):Yr;m>Yr&&console.warn(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Yr}`);let h=[],g=0;for(let e=0;e<Yr;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];si(t,3*v*(r>_-qr?r-_+qr:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,Xr)}};function ai(e){let t=[],n=[],r=[],i=e,a=e-qr+1+Jr.length;for(let o=0;o<a;o++){let a=2**i;n.push(a);let s=1/a;o>e-qr?s=Jr[o-e+qr-1]:o===0&&(s=0),r.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new Gn;h.setAttribute(`position`,new Pn(f,3)),h.setAttribute(`uv`,new Pn(p,2)),h.setAttribute(`faceIndex`,new Pn(m,1)),t.push(h),i>qr&&i--}return{lodPlanes:t,sizeLods:n,sigmas:r}}function oi(e,t,n){let r=new st(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function si(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function ci(e,t,n){let r=new Float32Array(Yr),i=new H(0,1,0);return new br({name:`SphericalGaussianBlur`,defines:{n:Yr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:di(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function li(){return new br({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:di(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ui(){return new br({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:di(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function di(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function fi(e){let t=new WeakMap,n=null;function r(r){if(r&&r.isTexture){let o=r.mapping,s=o===303||o===304,c=o===301||o===302;if(s||c){if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let i=t.get(r);return n===null&&(n=new ii(e)),i=s?n.fromEquirectangular(r,i):n.fromCubemap(r,i),t.set(r,i),i.texture}if(t.has(r))return t.get(r).texture;{let o=r.image;if(s&&o&&o.height>0||c&&o&&i(o)){n===null&&(n=new ii(e));let i=s?n.fromEquirectangular(r):n.fromCubemap(r);return t.set(r,i),r.addEventListener(`dispose`,a),i.texture}return null}}}return r}function i(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function a(e){let n=e.target;n.removeEventListener(`dispose`,a);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function o(){t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:o}}function pi(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r;switch(n){case`WEBGL_depth_texture`:r=e.getExtension(`WEBGL_depth_texture`)||e.getExtension(`MOZ_WEBGL_depth_texture`)||e.getExtension(`WEBKIT_WEBGL_depth_texture`);break;case`EXT_texture_filter_anisotropic`:r=e.getExtension(`EXT_texture_filter_anisotropic`)||e.getExtension(`MOZ_EXT_texture_filter_anisotropic`)||e.getExtension(`WEBKIT_EXT_texture_filter_anisotropic`);break;case`WEBGL_compressed_texture_s3tc`:r=e.getExtension(`WEBGL_compressed_texture_s3tc`)||e.getExtension(`MOZ_WEBGL_compressed_texture_s3tc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_s3tc`);break;case`WEBGL_compressed_texture_pvrtc`:r=e.getExtension(`WEBGL_compressed_texture_pvrtc`)||e.getExtension(`WEBKIT_WEBGL_compressed_texture_pvrtc`);break;default:r=e.getExtension(n)}return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(e){e.isWebGL2?(n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`)):(n(`WEBGL_depth_texture`),n(`OES_texture_float`),n(`OES_texture_half_float`),n(`OES_texture_half_float_linear`),n(`OES_standard_derivatives`),n(`OES_element_index_uint`),n(`OES_vertex_array_object`),n(`ANGLE_instanced_arrays`)),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`)},get:function(e){let t=n(e);return t===null&&console.warn(`THREE.WebGLRenderer: `+e+` extension not supported.`),t}}}function mi(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);for(let e in s.morphAttributes){let n=s.morphAttributes[e];for(let e=0,r=n.length;e<r;e++)t.remove(n[e])}s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER);let i=n.morphAttributes;for(let n in i){let r=i[n];for(let n=0,i=r.length;n<i;n++)t.update(r[n],e.ARRAY_BUFFER)}}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else if(i!==void 0){let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}else return;let s=new(Be(n)?In:Fn)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function hi(e,t,n,r){let i=r.isWebGL2,a;function o(e){a=e}let s,c;function l(e){s=e.type,c=e.bytesPerElement}function u(t,r){e.drawElements(a,r,s,t*c),n.update(r,a,1)}function d(r,o,l){if(l===0)return;let u,d;if(i)u=e,d=`drawElementsInstanced`;else if(u=t.get(`ANGLE_instanced_arrays`),d=`drawElementsInstancedANGLE`,u===null){console.error(`THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.`);return}u[d](a,o,s,r*c,l),n.update(o,a,l)}function f(e,r,i){if(i===0)return;let o=t.get(`WEBGL_multi_draw`);if(o===null)for(let t=0;t<i;t++)this.render(e[t]/c,r[t]);else{o.multiDrawElementsWEBGL(a,r,0,s,e,0,i);let t=0;for(let e=0;e<i;e++)t+=r[e];n.update(t,a,1)}}this.setMode=o,this.setIndex=l,this.render=u,this.renderInstances=d,this.renderMultiDraw=f}function gi(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:console.error(`THREE.WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function _i(e,t){return e[0]-t[0]}function vi(e,t){return Math.abs(t[1])-Math.abs(e[1])}function yi(e,t,n){let r={},i=new Float32Array(8),a=new WeakMap,o=new at,s=[];for(let e=0;e<8;e++)s[e]=[e,0];function c(c,l,u){let d=c.morphTargetInfluences;if(t.isWebGL2===!0){let r=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,i=r===void 0?0:r.length,s=a.get(l);if(s===void 0||s.count!==i){s!==void 0&&s.texture.dispose();let e=l.morphAttributes.position!==void 0,n=l.morphAttributes.normal!==void 0,r=l.morphAttributes.color!==void 0,c=l.morphAttributes.position||[],u=l.morphAttributes.normal||[],d=l.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),r===!0&&(f=3);let p=l.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*i),g=new ct(h,p,m,i);g.type=S,g.needsUpdate=!0;let _=f*4;for(let t=0;t<i;t++){let i=c[t],a=u[t],s=d[t],l=p*m*4*t;for(let t=0;t<i.count;t++){let c=t*_;e===!0&&(o.fromBufferAttribute(i,t),h[l+c+0]=o.x,h[l+c+1]=o.y,h[l+c+2]=o.z,h[l+c+3]=0),n===!0&&(o.fromBufferAttribute(a,t),h[l+c+4]=o.x,h[l+c+5]=o.y,h[l+c+6]=o.z,h[l+c+7]=0),r===!0&&(o.fromBufferAttribute(s,t),h[l+c+8]=o.x,h[l+c+9]=o.y,h[l+c+10]=o.z,h[l+c+11]=s.itemSize===4?o.w:1)}}s={count:i,texture:g,size:new B(p,m)},a.set(l,s);function v(){g.dispose(),a.delete(l),l.removeEventListener(`dispose`,v)}l.addEventListener(`dispose`,v)}let c=0;for(let e=0;e<d.length;e++)c+=d[e];let f=l.morphTargetsRelative?1:1-c;u.getUniforms().setValue(e,`morphTargetBaseInfluence`,f),u.getUniforms().setValue(e,`morphTargetInfluences`,d),u.getUniforms().setValue(e,`morphTargetsTexture`,s.texture,n),u.getUniforms().setValue(e,`morphTargetsTextureSize`,s.size)}else{let t=d===void 0?0:d.length,n=r[l.id];if(n===void 0||n.length!==t){n=[];for(let e=0;e<t;e++)n[e]=[e,0];r[l.id]=n}for(let e=0;e<t;e++){let t=n[e];t[0]=e,t[1]=d[e]}n.sort(vi);for(let e=0;e<8;e++)e<t&&n[e][1]?(s[e][0]=n[e][0],s[e][1]=n[e][1]):(s[e][0]=2**53-1,s[e][1]=0);s.sort(_i);let a=l.morphAttributes.position,o=l.morphAttributes.normal,c=0;for(let e=0;e<8;e++){let t=s[e],n=t[0],r=t[1];n!==2**53-1&&r?(a&&l.getAttribute(`morphTarget`+e)!==a[n]&&l.setAttribute(`morphTarget`+e,a[n]),o&&l.getAttribute(`morphNormal`+e)!==o[n]&&l.setAttribute(`morphNormal`+e,o[n]),i[e]=r,c+=r):(a&&l.hasAttribute(`morphTarget`+e)===!0&&l.deleteAttribute(`morphTarget`+e),o&&l.hasAttribute(`morphNormal`+e)===!0&&l.deleteAttribute(`morphNormal`+e),i[e]=0)}let f=l.morphTargetsRelative?1:1-c;u.getUniforms().setValue(e,`morphTargetBaseInfluence`,f),u.getUniforms().setValue(e,`morphTargetInfluences`,i)}}return{update:c}}function bi(e,t,n,r){let i=new WeakMap;function a(a){let o=r.render.frame,c=a.geometry,l=t.get(a,c);if(i.get(l)!==o&&(t.update(l),i.set(l,o)),a.isInstancedMesh&&(a.hasEventListener(`dispose`,s)===!1&&a.addEventListener(`dispose`,s),i.get(a)!==o&&(n.update(a.instanceMatrix,e.ARRAY_BUFFER),a.instanceColor!==null&&n.update(a.instanceColor,e.ARRAY_BUFFER),i.set(a,o))),a.isSkinnedMesh){let e=a.skeleton;i.get(e)!==o&&(e.update(),i.set(e,o))}return l}function o(){i=new WeakMap}function s(e){let t=e.target;t.removeEventListener(`dispose`,s),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:a,dispose:o}}var xi=class extends it{constructor(e,t,n,r,i,a,o,s,c,l){if(l=l===void 0?E:l,l!==1026&&l!==1027)throw Error(`DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);n===void 0&&l===1026&&(n=x),n===void 0&&l===1027&&(n=w),super(null,r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o===void 0?m:o,this.minFilter=s===void 0?m:s,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Si=new it,Ci=new xi(1,1);Ci.compareFunction=515;var wi=new ct,Ti=new lt,Ei=new Er,Di=[],Oi=[],ki=new Float32Array(16),Ai=new Float32Array(9),ji=new Float32Array(4);function Mi(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Di[i];if(a===void 0&&(a=new Float32Array(i),Di[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Ni(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Pi(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Fi(e,t){let n=Oi[t];n===void 0&&(n=new Int32Array(t),Oi[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Ii(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Li(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ni(n,t))return;e.uniform2fv(this.addr,t),Pi(n,t)}}function Ri(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Ni(n,t))return;e.uniform3fv(this.addr,t),Pi(n,t)}}function zi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ni(n,t))return;e.uniform4fv(this.addr,t),Pi(n,t)}}function Bi(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ni(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Pi(n,t)}else{if(Ni(n,r))return;ji.set(r),e.uniformMatrix2fv(this.addr,!1,ji),Pi(n,r)}}function Vi(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ni(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Pi(n,t)}else{if(Ni(n,r))return;Ai.set(r),e.uniformMatrix3fv(this.addr,!1,Ai),Pi(n,r)}}function Hi(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Ni(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Pi(n,t)}else{if(Ni(n,r))return;ki.set(r),e.uniformMatrix4fv(this.addr,!1,ki),Pi(n,r)}}function Ui(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Wi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ni(n,t))return;e.uniform2iv(this.addr,t),Pi(n,t)}}function Gi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ni(n,t))return;e.uniform3iv(this.addr,t),Pi(n,t)}}function Ki(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ni(n,t))return;e.uniform4iv(this.addr,t),Pi(n,t)}}function qi(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Ji(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Ni(n,t))return;e.uniform2uiv(this.addr,t),Pi(n,t)}}function Yi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Ni(n,t))return;e.uniform3uiv(this.addr,t),Pi(n,t)}}function Xi(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Ni(n,t))return;e.uniform4uiv(this.addr,t),Pi(n,t)}}function Zi(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a=this.type===e.SAMPLER_2D_SHADOW?Ci:Si;n.setTexture2D(t||a,i)}function Qi(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Ti,i)}function $i(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Ei,i)}function ea(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||wi,i)}function ta(e){switch(e){case 5126:return Ii;case 35664:return Li;case 35665:return Ri;case 35666:return zi;case 35674:return Bi;case 35675:return Vi;case 35676:return Hi;case 5124:case 35670:return Ui;case 35667:case 35671:return Wi;case 35668:case 35672:return Gi;case 35669:case 35673:return Ki;case 5125:return qi;case 36294:return Ji;case 36295:return Yi;case 36296:return Xi;case 35678:case 36198:case 36298:case 36306:case 35682:return Zi;case 35679:case 36299:case 36307:return Qi;case 35680:case 36300:case 36308:case 36293:return $i;case 36289:case 36303:case 36311:case 36292:return ea}}function na(e,t){e.uniform1fv(this.addr,t)}function ra(e,t){let n=Mi(t,this.size,2);e.uniform2fv(this.addr,n)}function ia(e,t){let n=Mi(t,this.size,3);e.uniform3fv(this.addr,n)}function aa(e,t){let n=Mi(t,this.size,4);e.uniform4fv(this.addr,n)}function oa(e,t){let n=Mi(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function sa(e,t){let n=Mi(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function ca(e,t){let n=Mi(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function la(e,t){e.uniform1iv(this.addr,t)}function ua(e,t){e.uniform2iv(this.addr,t)}function da(e,t){e.uniform3iv(this.addr,t)}function fa(e,t){e.uniform4iv(this.addr,t)}function pa(e,t){e.uniform1uiv(this.addr,t)}function ma(e,t){e.uniform2uiv(this.addr,t)}function ha(e,t){e.uniform3uiv(this.addr,t)}function ga(e,t){e.uniform4uiv(this.addr,t)}function _a(e,t,n){let r=this.cache,i=t.length,a=Fi(n,i);Ni(r,a)||(e.uniform1iv(this.addr,a),Pi(r,a));for(let e=0;e!==i;++e)n.setTexture2D(t[e]||Si,a[e])}function va(e,t,n){let r=this.cache,i=t.length,a=Fi(n,i);Ni(r,a)||(e.uniform1iv(this.addr,a),Pi(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Ti,a[e])}function ya(e,t,n){let r=this.cache,i=t.length,a=Fi(n,i);Ni(r,a)||(e.uniform1iv(this.addr,a),Pi(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Ei,a[e])}function ba(e,t,n){let r=this.cache,i=t.length,a=Fi(n,i);Ni(r,a)||(e.uniform1iv(this.addr,a),Pi(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||wi,a[e])}function xa(e){switch(e){case 5126:return na;case 35664:return ra;case 35665:return ia;case 35666:return aa;case 35674:return oa;case 35675:return sa;case 35676:return ca;case 5124:case 35670:return la;case 35667:case 35671:return ua;case 35668:case 35672:return da;case 35669:case 35673:return fa;case 5125:return pa;case 36294:return ma;case 36295:return ha;case 36296:return ga;case 35678:case 36198:case 36298:case 36306:case 35682:return _a;case 35679:case 36299:case 36307:return va;case 35680:case 36300:case 36308:case 36293:return ya;case 36289:case 36303:case 36311:case 36292:return ba}}var Sa=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=ta(t.type)}},Ca=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=xa(t.type)}},wa=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Ta=/(\w+)(\])?(\[|\.)?/g;function Ea(e,t){e.seq.push(t),e.map[t.id]=t}function Da(e,t,n){let r=e.name,i=r.length;for(Ta.lastIndex=0;;){let a=Ta.exec(r),o=Ta.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Ea(n,l===void 0?new Sa(s,e,t):new Ca(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new wa(s),Ea(n,e)),n=e}}}var Oa=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Da(n,e.getUniformLocation(t,n.name),this)}}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function ka(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Aa=37297,ja=0;function Ma(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}function Na(e){let t=Ye.getPrimaries(Ye.workingColorSpace),n=Ye.getPrimaries(e),r;switch(t===n?r=``:t===`p3`&&n===`rec709`?r=`LinearDisplayP3ToLinearSRGB`:t===`rec709`&&n===`p3`&&(r=`LinearSRGBToLinearDisplayP3`),e){case se:case le:return[r,`LinearTransferOETF`];case oe:case ce:return[r,`sRGBTransferOETF`];default:return console.warn(`THREE.WebGLProgram: Unsupported color space:`,e),[r,`LinearTransferOETF`]}}function Pa(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=e.getShaderInfoLog(t).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Ma(e.getShaderSource(t),r)}return i}function Fa(e,t){let n=Na(t);return`vec4 ${e}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function Ia(e,t){let n;switch(t){case 1:n=`Linear`;break;case 2:n=`Reinhard`;break;case 3:n=`OptimizedCineon`;break;case 4:n=`ACESFilmic`;break;case 6:n=`AgX`;break;case 5:n=`Custom`;break;default:console.warn(`THREE.WebGLProgram: Unsupported toneMapping:`,t),n=`Linear`}return`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}function La(e){return[e.extensionDerivatives||e.envMapCubeUVHeight||e.bumpMap||e.normalMapTangentSpace||e.clearcoatNormalMap||e.flatShading||e.shaderID===`physical`?`#extension GL_OES_standard_derivatives : enable`:``,(e.extensionFragDepth||e.logarithmicDepthBuffer)&&e.rendererExtensionFragDepth?`#extension GL_EXT_frag_depth : enable`:``,e.extensionDrawBuffers&&e.rendererExtensionDrawBuffers?`#extension GL_EXT_draw_buffers : require`:``,(e.extensionShaderTextureLOD||e.envMap||e.transmission)&&e.rendererExtensionShaderTextureLod?`#extension GL_EXT_shader_texture_lod : enable`:``].filter(Va).join(`
`)}function Ra(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``].filter(Va).join(`
`)}function za(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Ba(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Va(e){return e!==``}function Ha(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ua(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Wa=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ga(e){return e.replace(Wa,qa)}var Ka=new Map([[`encodings_fragment`,`colorspace_fragment`],[`encodings_pars_fragment`,`colorspace_pars_fragment`],[`output_fragment`,`opaque_fragment`]]);function qa(e,t){let n=G[t];if(n===void 0){let e=Ka.get(t);if(e!==void 0)n=G[e],console.warn(`THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`Can not resolve #include <`+t+`>`)}return Ga(n)}var Ja=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ya(e){return e.replace(Ja,Xa)}function Xa(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Za(e){let t=`precision `+e.precision+` float;
precision `+e.precision+` int;`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}function Qa(e){let t=`SHADOWMAP_TYPE_BASIC`;return e.shadowMapType===1?t=`SHADOWMAP_TYPE_PCF`:e.shadowMapType===2?t=`SHADOWMAP_TYPE_PCF_SOFT`:e.shadowMapType===3&&(t=`SHADOWMAP_TYPE_VSM`),t}function $a(e){let t=`ENVMAP_TYPE_CUBE`;if(e.envMap)switch(e.envMapMode){case 301:case 302:t=`ENVMAP_TYPE_CUBE`;break;case 306:t=`ENVMAP_TYPE_CUBE_UV`}return t}function eo(e){let t=`ENVMAP_MODE_REFLECTION`;if(e.envMap)switch(e.envMapMode){case 302:t=`ENVMAP_MODE_REFRACTION`}return t}function to(e){let t=`ENVMAP_BLENDING_NONE`;if(e.envMap)switch(e.combine){case 0:t=`ENVMAP_BLENDING_MULTIPLY`;break;case 1:t=`ENVMAP_BLENDING_MIX`;break;case 2:t=`ENVMAP_BLENDING_ADD`}return t}function no(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function ro(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Qa(n),l=$a(n),u=eo(n),d=to(n),f=no(n),p=n.isWebGL2?``:La(n),m=Ra(n),h=za(a),g=i.createProgram(),_,v,y=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,h].filter(Va).join(`
`),_.length>0&&(_+=`
`),v=[p,`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,h].filter(Va).join(`
`),v.length>0&&(v+=`
`)):(_=[Za(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,h,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors&&n.isWebGL2?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0&&n.isWebGL2?`#define MORPHTARGETS_TEXTURE`:``,n.morphTargetsCount>0&&n.isWebGL2?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0&&n.isWebGL2?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.useLegacyLights?`#define LEGACY_LIGHTS`:``,n.logarithmicDepthBuffer?`#define USE_LOGDEPTHBUF`:``,n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?`#define USE_LOGDEPTHBUF_EXT`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )`,`	attribute vec3 morphTarget0;`,`	attribute vec3 morphTarget1;`,`	attribute vec3 morphTarget2;`,`	attribute vec3 morphTarget3;`,`	#ifdef USE_MORPHNORMALS`,`		attribute vec3 morphNormal0;`,`		attribute vec3 morphNormal1;`,`		attribute vec3 morphNormal2;`,`		attribute vec3 morphNormal3;`,`	#else`,`		attribute vec3 morphTarget4;`,`		attribute vec3 morphTarget5;`,`		attribute vec3 morphTarget6;`,`		attribute vec3 morphTarget7;`,`	#endif`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Va).join(`
`),v=[p,Za(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,h,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.useLegacyLights?`#define LEGACY_LIGHTS`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.logarithmicDepthBuffer?`#define USE_LOGDEPTHBUF`:``,n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?`#define USE_LOGDEPTHBUF_EXT`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:G.tonemapping_pars_fragment,n.toneMapping===0?``:Ia(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,G.colorspace_pars_fragment,Fa(`linearToOutputTexel`,n.outputColorSpace),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Va).join(`
`)),o=Ga(o),o=Ha(o,n),o=Ua(o,n),s=Ga(s),s=Ha(s,n),s=Ua(s,n),o=Ya(o),s=Ya(s),n.isWebGL2&&n.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,_=[m,`precision mediump sampler2DArray;`,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+_,v=[`precision mediump sampler2DArray;`,`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+v);let b=y+_+o,x=y+v+s,S=ka(i,i.VERTEX_SHADER,b),C=ka(i,i.FRAGMENT_SHADER,x);i.attachShader(g,S),i.attachShader(g,C),n.index0AttributeName===void 0?n.morphTargets===!0&&i.bindAttribLocation(g,0,`position`):i.bindAttribLocation(g,0,n.index0AttributeName),i.linkProgram(g);function w(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(g).trim(),r=i.getShaderInfoLog(S).trim(),a=i.getShaderInfoLog(C).trim(),o=!0,s=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1){if(o=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,g,S,C);else{let e=Pa(i,S,`vertex`),t=Pa(i,C,`fragment`);console.error(`THREE.WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Program Info Log: `+n+`
`+e+`
`+t)}}else n===``?(r===``||a===``)&&(s=!1):console.warn(`THREE.WebGLProgram: Program Info Log:`,n);s&&(t.diagnostics={runnable:o,programLog:n,vertexShader:{log:r,prefix:_},fragmentShader:{log:a,prefix:v}})}i.deleteShader(S),i.deleteShader(C),T=new Oa(i,g),E=Ba(i,g)}let T;this.getUniforms=function(){return T===void 0&&w(this),T};let E;this.getAttributes=function(){return E===void 0&&w(this),E};let D=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=i.getProgramParameter(g,Aa)),D},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=ja++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=C,this}var io=0,ao=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),i=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new oo(e),t.set(e,n)),n}},oo=class{constructor(e){this.id=io++,this.code=e,this.usedTimes=0}};function so(e,t,n,r,i,a,o){let s=new Xt,c=new ao,l=[],u=i.isWebGL2,d=i.logarithmicDepthBuffer,f=i.vertexTextures,p=i.precision,m={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distanceRGBA`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function h(e){return e===0?`uv`:`uv${e}`}function g(a,s,l,g,_){let v=g.fog,y=_.geometry,b=a.isMeshStandardMaterial?g.environment:null,x=(a.isMeshStandardMaterial?n:t).get(a.envMap||b),S=x&&x.mapping===306?x.image.height:null,C=m[a.type];a.precision!==null&&(p=i.getMaxPrecision(a.precision),p!==a.precision&&console.warn(`THREE.WebGLProgram.getParameters:`,a.precision,`not supported, using`,p,`instead.`));let w=y.morphAttributes.position||y.morphAttributes.normal||y.morphAttributes.color,T=w===void 0?0:w.length,E=0;y.morphAttributes.position!==void 0&&(E=1),y.morphAttributes.normal!==void 0&&(E=2),y.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Rr[C];D=e.vertexShader,O=e.fragmentShader}else D=a.vertexShader,O=a.fragmentShader,c.update(a),k=c.getVertexShaderID(a),A=c.getFragmentShaderID(a);let j=e.getRenderTarget(),ee=_.isInstancedMesh===!0,M=_.isBatchedMesh===!0,N=!!a.map,te=!!a.matcap,ne=!!x,re=!!a.aoMap,ie=!!a.lightMap,ae=!!a.bumpMap,oe=!!a.normalMap,ce=!!a.displacementMap,le=!!a.emissiveMap,ue=!!a.metalnessMap,de=!!a.roughnessMap,fe=a.anisotropy>0,pe=a.clearcoat>0,me=a.iridescence>0,he=a.sheen>0,ge=a.transmission>0,_e=fe&&!!a.anisotropyMap,P=pe&&!!a.clearcoatMap,ve=pe&&!!a.clearcoatNormalMap,F=pe&&!!a.clearcoatRoughnessMap,I=me&&!!a.iridescenceMap,L=me&&!!a.iridescenceThicknessMap,R=he&&!!a.sheenColorMap,ye=he&&!!a.sheenRoughnessMap,be=!!a.specularMap,xe=!!a.specularColorMap,Se=!!a.specularIntensityMap,Ce=ge&&!!a.transmissionMap,we=ge&&!!a.thicknessMap,Te=!!a.gradientMap,Ee=!!a.alphaMap,De=a.alphaTest>0,Oe=!!a.alphaHash,ke=!!a.extensions,Ae=!!y.attributes.uv1,je=!!y.attributes.uv2,Me=!!y.attributes.uv3,Ne=0;return a.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ne=e.toneMapping),{isWebGL2:u,shaderID:C,shaderType:a.type,shaderName:a.name,vertexShader:D,fragmentShader:O,defines:a.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:a.isRawShaderMaterial===!0,glslVersion:a.glslVersion,precision:p,batching:M,instancing:ee,instancingColor:ee&&_.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:se,map:N,matcap:te,envMap:ne,envMapMode:ne&&x.mapping,envMapCubeUVHeight:S,aoMap:re,lightMap:ie,bumpMap:ae,normalMap:oe,displacementMap:f&&ce,emissiveMap:le,normalMapObjectSpace:oe&&a.normalMapType===1,normalMapTangentSpace:oe&&a.normalMapType===0,metalnessMap:ue,roughnessMap:de,anisotropy:fe,anisotropyMap:_e,clearcoat:pe,clearcoatMap:P,clearcoatNormalMap:ve,clearcoatRoughnessMap:F,iridescence:me,iridescenceMap:I,iridescenceThicknessMap:L,sheen:he,sheenColorMap:R,sheenRoughnessMap:ye,specularMap:be,specularColorMap:xe,specularIntensityMap:Se,transmission:ge,transmissionMap:Ce,thicknessMap:we,gradientMap:Te,opaque:a.transparent===!1&&a.blending===1,alphaMap:Ee,alphaTest:De,alphaHash:Oe,combine:a.combine,mapUv:N&&h(a.map.channel),aoMapUv:re&&h(a.aoMap.channel),lightMapUv:ie&&h(a.lightMap.channel),bumpMapUv:ae&&h(a.bumpMap.channel),normalMapUv:oe&&h(a.normalMap.channel),displacementMapUv:ce&&h(a.displacementMap.channel),emissiveMapUv:le&&h(a.emissiveMap.channel),metalnessMapUv:ue&&h(a.metalnessMap.channel),roughnessMapUv:de&&h(a.roughnessMap.channel),anisotropyMapUv:_e&&h(a.anisotropyMap.channel),clearcoatMapUv:P&&h(a.clearcoatMap.channel),clearcoatNormalMapUv:ve&&h(a.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:F&&h(a.clearcoatRoughnessMap.channel),iridescenceMapUv:I&&h(a.iridescenceMap.channel),iridescenceThicknessMapUv:L&&h(a.iridescenceThicknessMap.channel),sheenColorMapUv:R&&h(a.sheenColorMap.channel),sheenRoughnessMapUv:ye&&h(a.sheenRoughnessMap.channel),specularMapUv:be&&h(a.specularMap.channel),specularColorMapUv:xe&&h(a.specularColorMap.channel),specularIntensityMapUv:Se&&h(a.specularIntensityMap.channel),transmissionMapUv:Ce&&h(a.transmissionMap.channel),thicknessMapUv:we&&h(a.thicknessMap.channel),alphaMapUv:Ee&&h(a.alphaMap.channel),vertexTangents:!!y.attributes.tangent&&(oe||fe),vertexColors:a.vertexColors,vertexAlphas:a.vertexColors===!0&&!!y.attributes.color&&y.attributes.color.itemSize===4,vertexUv1s:Ae,vertexUv2s:je,vertexUv3s:Me,pointsUvs:_.isPoints===!0&&!!y.attributes.uv&&(N||Ee),fog:!!v,useFog:a.fog===!0,fogExp2:v&&v.isFogExp2,flatShading:a.flatShading===!0,sizeAttenuation:a.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:_.isSkinnedMesh===!0,morphTargets:y.morphAttributes.position!==void 0,morphNormals:y.morphAttributes.normal!==void 0,morphColors:y.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:s.directional.length,numPointLights:s.point.length,numSpotLights:s.spot.length,numSpotLightMaps:s.spotLightMap.length,numRectAreaLights:s.rectArea.length,numHemiLights:s.hemi.length,numDirLightShadows:s.directionalShadowMap.length,numPointLightShadows:s.pointShadowMap.length,numSpotLightShadows:s.spotShadowMap.length,numSpotLightShadowsWithMaps:s.numSpotLightShadowsWithMaps,numLightProbes:s.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:a.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ne,useLegacyLights:e._useLegacyLights,decodeVideoTexture:N&&a.map.isVideoTexture===!0&&Ye.getTransfer(a.map.colorSpace)===`srgb`,premultipliedAlpha:a.premultipliedAlpha,doubleSided:a.side===2,flipSided:a.side===1,useDepthPacking:a.depthPacking>=0,depthPacking:a.depthPacking||0,index0AttributeName:a.index0AttributeName,extensionDerivatives:ke&&a.extensions.derivatives===!0,extensionFragDepth:ke&&a.extensions.fragDepth===!0,extensionDrawBuffers:ke&&a.extensions.drawBuffers===!0,extensionShaderTextureLOD:ke&&a.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ke&&a.extensions.clipCullDistance&&r.has(`WEBGL_clip_cull_distance`),rendererExtensionFragDepth:u||r.has(`EXT_frag_depth`),rendererExtensionDrawBuffers:u||r.has(`WEBGL_draw_buffers`),rendererExtensionShaderTextureLod:u||r.has(`EXT_shader_texture_lod`),rendererExtensionParallelShaderCompile:r.has(`KHR_parallel_shader_compile`),customProgramCacheKey:a.customProgramCacheKey()}}function _(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(v(n,t),y(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function v(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function y(e,t){s.disableAll(),t.isWebGL2&&s.enable(0),t.supportsVertexTextures&&s.enable(1),t.instancing&&s.enable(2),t.instancingColor&&s.enable(3),t.matcap&&s.enable(4),t.envMap&&s.enable(5),t.normalMapObjectSpace&&s.enable(6),t.normalMapTangentSpace&&s.enable(7),t.clearcoat&&s.enable(8),t.iridescence&&s.enable(9),t.alphaTest&&s.enable(10),t.vertexColors&&s.enable(11),t.vertexAlphas&&s.enable(12),t.vertexUv1s&&s.enable(13),t.vertexUv2s&&s.enable(14),t.vertexUv3s&&s.enable(15),t.vertexTangents&&s.enable(16),t.anisotropy&&s.enable(17),t.alphaHash&&s.enable(18),t.batching&&s.enable(19),e.push(s.mask),s.disableAll(),t.fog&&s.enable(0),t.useFog&&s.enable(1),t.flatShading&&s.enable(2),t.logarithmicDepthBuffer&&s.enable(3),t.skinning&&s.enable(4),t.morphTargets&&s.enable(5),t.morphNormals&&s.enable(6),t.morphColors&&s.enable(7),t.premultipliedAlpha&&s.enable(8),t.shadowMapEnabled&&s.enable(9),t.useLegacyLights&&s.enable(10),t.doubleSided&&s.enable(11),t.flipSided&&s.enable(12),t.useDepthPacking&&s.enable(13),t.dithering&&s.enable(14),t.transmission&&s.enable(15),t.sheen&&s.enable(16),t.opaque&&s.enable(17),t.pointsUvs&&s.enable(18),t.decodeVideoTexture&&s.enable(19),e.push(s.mask)}function b(e){let t=m[e.type],n;if(t){let e=Rr[t];n=_r.clone(e.uniforms)}else n=e.uniforms;return n}function x(t,n){let r;for(let e=0,t=l.length;e<t;e++){let t=l[e];if(t.cacheKey===n){r=t,++r.usedTimes;break}}return r===void 0&&(r=new ro(e,n,t,a),l.push(r)),r}function S(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),e.destroy()}}function C(e){c.remove(e)}function w(){c.dispose()}return{getParameters:g,getProgramCacheKey:_,getUniforms:b,acquireProgram:x,releaseProgram:S,releaseShaderCache:C,programs:l,dispose:w}}function co(){let e=new WeakMap;function t(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function n(t){e.delete(t)}function r(t,n,r){e.get(t)[n]=r}function i(){e=new WeakMap}return{get:t,remove:n,update:r,dispose:i}}function lo(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.z===t.z?e.id-t.id:e.z-t.z:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function uo(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function fo(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(n,r,i,a,o,s){let c=e[t];return c===void 0?(c={id:n.id,object:n,geometry:r,material:i,groupOrder:a,renderOrder:n.renderOrder,z:o,group:s},e[t]=c):(c.id=n.id,c.object=n,c.geometry=r,c.material=i,c.groupOrder=a,c.renderOrder=n.renderOrder,c.z=o,c.group=s),t++,c}function s(e,t,a,s,c,l){let u=o(e,t,a,s,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function c(e,t,a,s,c,l){let u=o(e,t,a,s,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function l(e,t){n.length>1&&n.sort(e||lo),r.length>1&&r.sort(t||uo),i.length>1&&i.sort(t||uo)}function u(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:s,unshift:c,finish:u,sort:l}}function po(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new fo,e.set(t,[i])):n>=r.length?(i=new fo,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function mo(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new H,color:new W};break;case`SpotLight`:n={position:new H,direction:new H,color:new W,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new H,color:new W,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new H,skyColor:new W,groundColor:new W};break;case`RectAreaLight`:n={color:new W,position:new H,halfWidth:new H,halfHeight:new H}}return e[t.id]=n,n}}}function ho(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`SpotLight`:n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`PointLight`:n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var go=0;function _o(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function vo(e,t){let n=new mo,r=ho(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)i.probe.push(new H);let a=new H,o=new U,s=new U;function c(a,o){let s=0,c=0,l=0;for(let e=0;e<9;e++)i.probe[e].set(0,0,0);let u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0;a.sort(_o);let x=o===!0?Math.PI:1;for(let e=0,t=a.length;e<t;e++){let t=a[e],o=t.color,S=t.intensity,C=t.distance,w=t.shadow&&t.shadow.map?t.shadow.map.texture:null;if(t.isAmbientLight)s+=o.r*S*x,c+=o.g*S*x,l+=o.b*S*x;else if(t.isLightProbe){for(let e=0;e<9;e++)i.probe[e].addScaledVector(t.sh.coefficients[e],S);b++}else if(t.isDirectionalLight){let e=n.get(t);if(e.color.copy(t.color).multiplyScalar(t.intensity*x),t.castShadow){let e=t.shadow,n=r.get(t);n.shadowBias=e.bias,n.shadowNormalBias=e.normalBias,n.shadowRadius=e.radius,n.shadowMapSize=e.mapSize,i.directionalShadow[u]=n,i.directionalShadowMap[u]=w,i.directionalShadowMatrix[u]=t.shadow.matrix,h++}i.directional[u]=e,u++}else if(t.isSpotLight){let e=n.get(t);e.position.setFromMatrixPosition(t.matrixWorld),e.color.copy(o).multiplyScalar(S*x),e.distance=C,e.coneCos=Math.cos(t.angle),e.penumbraCos=Math.cos(t.angle*(1-t.penumbra)),e.decay=t.decay,i.spot[f]=e;let a=t.shadow;if(t.map&&(i.spotLightMap[v]=t.map,v++,a.updateMatrices(t),t.castShadow&&y++),i.spotLightMatrix[f]=a.matrix,t.castShadow){let e=r.get(t);e.shadowBias=a.bias,e.shadowNormalBias=a.normalBias,e.shadowRadius=a.radius,e.shadowMapSize=a.mapSize,i.spotShadow[f]=e,i.spotShadowMap[f]=w,_++}f++}else if(t.isRectAreaLight){let e=n.get(t);e.color.copy(o).multiplyScalar(S),e.halfWidth.set(t.width*.5,0,0),e.halfHeight.set(0,t.height*.5,0),i.rectArea[p]=e,p++}else if(t.isPointLight){let e=n.get(t);if(e.color.copy(t.color).multiplyScalar(t.intensity*x),e.distance=t.distance,e.decay=t.decay,t.castShadow){let e=t.shadow,n=r.get(t);n.shadowBias=e.bias,n.shadowNormalBias=e.normalBias,n.shadowRadius=e.radius,n.shadowMapSize=e.mapSize,n.shadowCameraNear=e.camera.near,n.shadowCameraFar=e.camera.far,i.pointShadow[d]=n,i.pointShadowMap[d]=w,i.pointShadowMatrix[d]=t.shadow.matrix,g++}i.point[d]=e,d++}else if(t.isHemisphereLight){let e=n.get(t);e.skyColor.copy(t.color).multiplyScalar(S*x),e.groundColor.copy(t.groundColor).multiplyScalar(S*x),i.hemi[m]=e,m++}}p>0&&(t.isWebGL2?e.has(`OES_texture_float_linear`)===!0?(i.rectAreaLTC1=K.LTC_FLOAT_1,i.rectAreaLTC2=K.LTC_FLOAT_2):(i.rectAreaLTC1=K.LTC_HALF_1,i.rectAreaLTC2=K.LTC_HALF_2):e.has(`OES_texture_float_linear`)===!0?(i.rectAreaLTC1=K.LTC_FLOAT_1,i.rectAreaLTC2=K.LTC_FLOAT_2):e.has(`OES_texture_half_float_linear`)===!0?(i.rectAreaLTC1=K.LTC_HALF_1,i.rectAreaLTC2=K.LTC_HALF_2):console.error(`THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.`)),i.ambient[0]=s,i.ambient[1]=c,i.ambient[2]=l;let S=i.hash;(S.directionalLength!==u||S.pointLength!==d||S.spotLength!==f||S.rectAreaLength!==p||S.hemiLength!==m||S.numDirectionalShadows!==h||S.numPointShadows!==g||S.numSpotShadows!==_||S.numSpotMaps!==v||S.numLightProbes!==b)&&(i.directional.length=u,i.spot.length=f,i.rectArea.length=p,i.point.length=d,i.hemi.length=m,i.directionalShadow.length=h,i.directionalShadowMap.length=h,i.pointShadow.length=g,i.pointShadowMap.length=g,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=h,i.pointShadowMatrix.length=g,i.spotLightMatrix.length=_+v-y,i.spotLightMap.length=v,i.numSpotLightShadowsWithMaps=y,i.numLightProbes=b,S.directionalLength=u,S.pointLength=d,S.spotLength=f,S.rectAreaLength=p,S.hemiLength=m,S.numDirectionalShadows=h,S.numPointShadows=g,S.numSpotShadows=_,S.numSpotMaps=v,S.numLightProbes=b,i.version=go++)}function l(e,t){let n=0,r=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=i.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),a.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(a),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=i.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),a.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(a),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=i.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s.identity(),o.copy(f.matrixWorld),o.premultiply(d),s.extractRotation(o),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(s),e.halfHeight.applyMatrix4(s),l++}else if(f.isPointLight){let e=i.point[r];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),r++}else if(f.isHemisphereLight){let e=i.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:c,setupView:l,state:i}}function yo(e,t){let n=new vo(e,t),r=[],i=[];function a(){r.length=0,i.length=0}function o(e){r.push(e)}function s(e){i.push(e)}function c(e){n.setup(r,e)}function l(e){n.setupView(r,e)}return{init:a,state:{lightsArray:r,shadowsArray:i,lights:n},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function bo(e,t){let n=new WeakMap;function r(r,i=0){let a=n.get(r),o;return a===void 0?(o=new yo(e,t),n.set(r,[o])):i>=a.length?(o=new yo(e,t),a.push(o)):o=a[i],o}function i(){n=new WeakMap}return{get:r,dispose:i}}var xo=class extends An{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=ie,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},So=class extends An{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},Co=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wo=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function To(e,t,n){let r=new Pr,i=new B,a=new B,o=new at,s=new xo({depthPacking:ae}),c=new So,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new br({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new B},radius:{value:4}},vertexShader:Co,fragmentShader:wo}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let h=new Gn;h.setAttribute(`position`,new Pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new lr(h,f),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let v=this.type;this.render=function(t,n,s){if(_.enabled===!1||_.autoUpdate===!1&&_.needsUpdate===!1||t.length===0)return;let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=v!==3&&this.type===3,h=v===3&&this.type!==3;for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){console.warn(`THREE.WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let g=d.getFrameExtents();if(i.multiply(g),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/g.x),i.x=a.x*g.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/g.y),i.y=a.y*g.y,d.mapSize.y=a.y)),d.map===null||p===!0||h===!0){let e=this.type===3?{}:{minFilter:m,magFilter:m};d.map!==null&&d.map.dispose(),d.map=new st(i.x,i.y,e),d.map.texture.name=l.name+`.shadowMap`,d.camera.updateProjectionMatrix()}e.setRenderTarget(d.map),e.clear();let _=d.getViewportCount();for(let e=0;e<_;e++){let t=d.getViewport(e);o.set(a.x*t.x,a.y*t.y,a.x*t.z,a.y*t.w),f.viewport(o),d.updateMatrices(l,e),r=d.getFrustum(),x(n,s,d.camera,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&y(d,s),d.needsUpdate=!1}v=this.type,_.needsUpdate=!1,e.setRenderTarget(c,l,d)};function y(n,r){let a=t.update(g);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new st(i.x,i.y)),f.uniforms.shadow_pass.value=n.map.texture,f.uniforms.resolution.value=n.mapSize,f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,g,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,g,null)}function b(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,S)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function x(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=b(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=b(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)x(c[e],i,a,o,s)}function S(e){e.target.removeEventListener(`dispose`,S);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Eo(e,t,n){let r=n.isWebGL2;function i(){let t=!1,n=new at,r=null,i=new at(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function a(){let t=!1,n=null,r=null,i=null;return{setTest:function(t){t?de(e.DEPTH_TEST):fe(e.DEPTH_TEST)},setMask:function(r){n!==r&&!t&&(e.depthMask(r),n=r)},setFunc:function(t){if(r!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}r=t}},setLocked:function(e){t=e},setClear:function(t){i!==t&&(e.clearDepth(t),i=t)},reset:function(){t=!1,n=null,r=null,i=null}}}function o(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?de(e.STENCIL_TEST):fe(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let s=new i,c=new a,l=new o,u=new WeakMap,d=new WeakMap,f={},p={},m=new WeakMap,h=[],g=null,_=!1,v=null,y=null,b=null,x=null,S=null,C=null,w=null,T=new W(0,0,0),E=0,D=!1,O=null,k=null,A=null,j=null,ee=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,te=0,ne=e.getParameter(e.VERSION);ne.indexOf(`WebGL`)===-1?ne.indexOf(`OpenGL ES`)!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),N=te>=2):(te=parseFloat(/^WebGL (\d)/.exec(ne)[1]),N=te>=1);let re=null,ie={},ae=e.getParameter(e.SCISSOR_BOX),oe=e.getParameter(e.VIEWPORT),se=new at().fromArray(ae),ce=new at().fromArray(oe);function le(t,n,i,a){let o=new Uint8Array(4),s=e.createTexture();e.bindTexture(t,s),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let s=0;s<i;s++)r&&(t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY)?e.texImage3D(n,0,e.RGBA,1,1,a,0,e.RGBA,e.UNSIGNED_BYTE,o):e.texImage2D(n+s,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,o);return s}let ue={};ue[e.TEXTURE_2D]=le(e.TEXTURE_2D,e.TEXTURE_2D,1),ue[e.TEXTURE_CUBE_MAP]=le(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),r&&(ue[e.TEXTURE_2D_ARRAY]=le(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ue[e.TEXTURE_3D]=le(e.TEXTURE_3D,e.TEXTURE_3D,1,1)),s.setClear(0,0,0,1),c.setClear(1),l.setClear(0),de(e.DEPTH_TEST),c.setFunc(3),F(!1),I(1),de(e.CULL_FACE),P(0);function de(t){f[t]!==!0&&(e.enable(t),f[t]=!0)}function fe(t){f[t]!==!1&&(e.disable(t),f[t]=!1)}function pe(t,n){return p[t]!==n&&(e.bindFramebuffer(t,n),p[t]=n,r&&(t===e.DRAW_FRAMEBUFFER&&(p[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(p[e.DRAW_FRAMEBUFFER]=n)),!0)}function me(r,i){let a=h,o=!1;if(r){if(a=m.get(i),a===void 0&&(a=[],m.set(i,a)),r.isWebGLMultipleRenderTargets){let t=r.texture;if(a.length!==t.length||a[0]!==e.COLOR_ATTACHMENT0){for(let n=0,r=t.length;n<r;n++)a[n]=e.COLOR_ATTACHMENT0+n;a.length=t.length,o=!0}}else a[0]!==e.COLOR_ATTACHMENT0&&(a[0]=e.COLOR_ATTACHMENT0,o=!0)}else a[0]!==e.BACK&&(a[0]=e.BACK,o=!0);o&&(n.isWebGL2?e.drawBuffers(a):t.get(`WEBGL_draw_buffers`).drawBuffersWEBGL(a))}function he(t){return g!==t&&(e.useProgram(t),g=t,!0)}let ge={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};if(r)ge[103]=e.MIN,ge[104]=e.MAX;else{let e=t.get(`EXT_blend_minmax`);e!==null&&(ge[103]=e.MIN_EXT,ge[104]=e.MAX_EXT)}let _e={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function P(t,n,r,i,a,o,s,c,l,u){if(t===0)_===!0&&(fe(e.BLEND),_=!1);else if(_===!1&&(de(e.BLEND),_=!0),t!==5){if(t!==v||u!==D){if((y!==100||S!==100)&&(e.blendEquation(e.FUNC_ADD),y=100,S=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.ZERO,e.SRC_COLOR,e.ZERO,e.SRC_ALPHA);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.SRC_ALPHA,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFunc(e.ZERO,e.SRC_COLOR);break;default:console.error(`THREE.WebGLState: Invalid blending: `,t)}b=null,x=null,C=null,w=null,T.set(0,0,0),E=0,v=t,D=u}}else a||=n,o||=r,s||=i,(n!==y||a!==S)&&(e.blendEquationSeparate(ge[n],ge[a]),y=n,S=a),(r!==b||i!==x||o!==C||s!==w)&&(e.blendFuncSeparate(_e[r],_e[i],_e[o],_e[s]),b=r,x=i,C=o,w=s),(c.equals(T)===!1||l!==E)&&(e.blendColor(c.r,c.g,c.b,l),T.copy(c),E=l),v=t,D=!1}function ve(t,n){t.side===2?fe(e.CULL_FACE):de(e.CULL_FACE);let r=t.side===1;n&&(r=!r),F(r),t.blending===1&&t.transparent===!1?P(0):P(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),c.setFunc(t.depthFunc),c.setTest(t.depthTest),c.setMask(t.depthWrite),s.setMask(t.colorWrite);let i=t.stencilWrite;l.setTest(i),i&&(l.setMask(t.stencilWriteMask),l.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),l.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),R(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?de(e.SAMPLE_ALPHA_TO_COVERAGE):fe(e.SAMPLE_ALPHA_TO_COVERAGE)}function F(t){O!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),O=t)}function I(t){t===0?fe(e.CULL_FACE):(de(e.CULL_FACE),t!==k&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),k=t}function L(t){t!==A&&(N&&e.lineWidth(t),A=t)}function R(t,n,r){t?(de(e.POLYGON_OFFSET_FILL),(j!==n||ee!==r)&&(e.polygonOffset(n,r),j=n,ee=r)):fe(e.POLYGON_OFFSET_FILL)}function ye(t){t?de(e.SCISSOR_TEST):fe(e.SCISSOR_TEST)}function be(t){t===void 0&&(t=e.TEXTURE0+M-1),re!==t&&(e.activeTexture(t),re=t)}function xe(t,n,r){r===void 0&&(r=re===null?e.TEXTURE0+M-1:re);let i=ie[r];i===void 0&&(i={type:void 0,texture:void 0},ie[r]=i),(i.type!==t||i.texture!==n)&&(re!==r&&(e.activeTexture(r),re=r),e.bindTexture(t,n||ue[t]),i.type=t,i.texture=n)}function Se(){let t=ie[re];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ce(){try{e.compressedTexImage2D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function we(){try{e.compressedTexImage3D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Te(){try{e.texSubImage2D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ee(){try{e.texSubImage3D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function De(){try{e.compressedTexSubImage2D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage3D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function ke(){try{e.texStorage2D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ae(){try{e.texStorage3D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function je(){try{e.texImage2D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Me(){try{e.texImage3D.apply(e,arguments)}catch(e){console.error(`THREE.WebGLState:`,e)}}function Ne(t){se.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),se.copy(t))}function Pe(t){ce.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ce.copy(t))}function Fe(t,n){let r=d.get(n);r===void 0&&(r=new WeakMap,d.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ie(t,n){let r=d.get(n).get(t);u.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),u.set(n,r))}function Le(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),r===!0&&(e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null)),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),f={},re=null,ie={},p={},m=new WeakMap,h=[],g=null,_=!1,v=null,y=null,b=null,x=null,S=null,C=null,w=null,T=new W(0,0,0),E=0,D=!1,O=null,k=null,A=null,j=null,ee=null,se.set(0,0,e.canvas.width,e.canvas.height),ce.set(0,0,e.canvas.width,e.canvas.height),s.reset(),c.reset(),l.reset()}return{buffers:{color:s,depth:c,stencil:l},enable:de,disable:fe,bindFramebuffer:pe,drawBuffers:me,useProgram:he,setBlending:P,setMaterial:ve,setFlipSided:F,setCullFace:I,setLineWidth:L,setPolygonOffset:R,setScissorTest:ye,activeTexture:be,bindTexture:xe,unbindTexture:Se,compressedTexImage2D:Ce,compressedTexImage3D:we,texImage2D:je,texImage3D:Me,updateUBOMapping:Fe,uniformBlockBinding:Ie,texStorage2D:ke,texStorage3D:Ae,texSubImage2D:Te,texSubImage3D:Ee,compressedTexSubImage2D:De,compressedTexSubImage3D:Oe,scissor:Ne,viewport:Pe,reset:Le}}function Do(e,t,n,r,i,a,o){let s=i.isWebGL2,c=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,l=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap,b,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function T(e,t){return C?new OffscreenCanvas(e,t):Ve(`canvas`)}function E(e,t,n,r){let i=1;if((e.width>r||e.height>r)&&(i=r/Math.max(e.width,e.height)),i<1||t===!0){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let r=t?Fe:Math.floor,a=r(i*e.width),o=r(i*e.height);b===void 0&&(b=T(a,o));let s=n?T(a,o):b;return s.width=a,s.height=o,s.getContext(`2d`).drawImage(e,0,0,a,o),console.warn(`THREE.WebGLRenderer: Texture has been resized from (`+e.width+`x`+e.height+`) to (`+a+`x`+o+`).`),s}return`data`in e&&console.warn(`THREE.WebGLRenderer: Image in DataTexture is too big (`+e.width+`x`+e.height+`).`),e}return e}function D(e){return Ne(e.width)&&Ne(e.height)}function O(e){return s?!1:e.wrapS!==1001||e.wrapT!==1001||e.minFilter!==1003&&e.minFilter!==1006}function k(e,t){return e.generateMipmaps&&t&&e.minFilter!==1003&&e.minFilter!==1006}function A(t){e.generateMipmap(t)}function j(n,r,i,a,o=!1){if(s===!1)return r;if(n!==null){if(e[n]!==void 0)return e[n];console.warn(`THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c=r;if(r===e.RED&&(i===e.FLOAT&&(c=e.R32F),i===e.HALF_FLOAT&&(c=e.R16F),i===e.UNSIGNED_BYTE&&(c=e.R8)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(c=e.R8UI),i===e.UNSIGNED_SHORT&&(c=e.R16UI),i===e.UNSIGNED_INT&&(c=e.R32UI),i===e.BYTE&&(c=e.R8I),i===e.SHORT&&(c=e.R16I),i===e.INT&&(c=e.R32I)),r===e.RG&&(i===e.FLOAT&&(c=e.RG32F),i===e.HALF_FLOAT&&(c=e.RG16F),i===e.UNSIGNED_BYTE&&(c=e.RG8)),r===e.RGBA){let t=o?ue:Ye.getTransfer(a);i===e.FLOAT&&(c=e.RGBA32F),i===e.HALF_FLOAT&&(c=e.RGBA16F),i===e.UNSIGNED_BYTE&&(c=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT_4_4_4_4&&(c=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(c=e.RGB5_A1)}return(c===e.R16F||c===e.R32F||c===e.RG16F||c===e.RG32F||c===e.RGBA16F||c===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),c}function ee(e,t,n){return k(e,n)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function M(t){return t===1003||t===1004||t===1005?e.NEAREST:e.LINEAR}function N(e){let t=e.target;t.removeEventListener(`dispose`,N),ne(t),t.isVideoTexture&&u.delete(t)}function te(e){let t=e.target;t.removeEventListener(`dispose`,te),ie(t)}function ne(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=S.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&re(e),Object.keys(i).length===0&&S.delete(n)}r.remove(e)}function re(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=S.get(i);delete a[n.__cacheKey],o.memory.textures--}function ie(t){let n=t.texture,i=r.get(t),a=r.get(n);if(a.__webglTexture!==void 0&&(e.deleteTexture(a.__webglTexture),o.memory.textures--),t.depthTexture&&t.depthTexture.dispose(),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(i.__webglFramebuffer[t]))for(let n=0;n<i.__webglFramebuffer[t].length;n++)e.deleteFramebuffer(i.__webglFramebuffer[t][n]);else e.deleteFramebuffer(i.__webglFramebuffer[t]);i.__webglDepthbuffer&&e.deleteRenderbuffer(i.__webglDepthbuffer[t])}else{if(Array.isArray(i.__webglFramebuffer))for(let t=0;t<i.__webglFramebuffer.length;t++)e.deleteFramebuffer(i.__webglFramebuffer[t]);else e.deleteFramebuffer(i.__webglFramebuffer);if(i.__webglDepthbuffer&&e.deleteRenderbuffer(i.__webglDepthbuffer),i.__webglMultisampledFramebuffer&&e.deleteFramebuffer(i.__webglMultisampledFramebuffer),i.__webglColorRenderbuffer)for(let t=0;t<i.__webglColorRenderbuffer.length;t++)i.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(i.__webglColorRenderbuffer[t]);i.__webglDepthRenderbuffer&&e.deleteRenderbuffer(i.__webglDepthRenderbuffer)}if(t.isWebGLMultipleRenderTargets)for(let t=0,i=n.length;t<i;t++){let i=r.get(n[t]);i.__webglTexture&&(e.deleteTexture(i.__webglTexture),o.memory.textures--),r.remove(n[t])}r.remove(n),r.remove(t)}let ae=0;function oe(){ae=0}function se(){let e=ae;return e>=i.maxTextures&&console.warn(`THREE.WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+i.maxTextures),ae+=1,e}function ce(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function le(t,i){let a=r.get(t);if(t.isVideoTexture&&De(t),t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)console.warn(`THREE.WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)console.warn(`THREE.WebGLRenderer: Texture marked for update but image is incomplete`);else{F(a,t,i);return}}n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function de(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?F(a,t,i):n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function fe(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?F(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function pe(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?I(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let me={[d]:e.REPEAT,[f]:e.CLAMP_TO_EDGE,[p]:e.MIRRORED_REPEAT},ge={[m]:e.NEAREST,[h]:e.NEAREST_MIPMAP_NEAREST,[g]:e.NEAREST_MIPMAP_LINEAR,[_]:e.LINEAR,[v]:e.LINEAR_MIPMAP_NEAREST,[y]:e.LINEAR_MIPMAP_LINEAR},_e={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function P(n,a,o){if(o?(e.texParameteri(n,e.TEXTURE_WRAP_S,me[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,me[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,me[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ge[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ge[a.minFilter])):(e.texParameteri(n,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(n,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,e.CLAMP_TO_EDGE),(a.wrapS!==1001||a.wrapT!==1001)&&console.warn(`THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping.`),e.texParameteri(n,e.TEXTURE_MAG_FILTER,M(a.magFilter)),e.texParameteri(n,e.TEXTURE_MIN_FILTER,M(a.minFilter)),a.minFilter!==1003&&a.minFilter!==1006&&console.warn(`THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.`)),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,_e[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){let o=t.get(`EXT_texture_filter_anisotropic`);if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1||s===!1&&a.type===1016&&t.has(`OES_texture_half_float_linear`)===!1)return;(a.anisotropy>1||r.get(a).__currentAnisotropy)&&(e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy)}}function ve(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,N));let i=n.source,a=S.get(i);a===void 0&&(a={},S.set(i,a));let s=ce(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&re(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function F(t,o,c){let l=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(l=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(l=e.TEXTURE_3D);let u=ve(t,o),d=o.source;n.bindTexture(l,t.__webglTexture,e.TEXTURE0+c);let f=r.get(d);if(d.version!==f.__version||u===!0){n.activeTexture(e.TEXTURE0+c);let t=Ye.getPrimaries(Ye.workingColorSpace),r=o.colorSpace===``?null:Ye.getPrimaries(o.colorSpace),p=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,p);let m=O(o)&&D(o.image)===!1,h=E(o.image,m,!1,i.maxTextureSize);h=Oe(o,h);let g=D(h)||s,_=a.convert(o.format,o.colorSpace),v=a.convert(o.type),y=j(o.internalFormat,_,v,o.colorSpace,o.isVideoTexture);P(l,o,g);let b,S=o.mipmaps,C=s&&o.isVideoTexture!==!0&&y!==36196,T=f.__version===void 0||u===!0,M=ee(o,h,g);if(o.isDepthTexture)y=e.DEPTH_COMPONENT,s?y=o.type===1015?e.DEPTH_COMPONENT32F:o.type===1014?e.DEPTH_COMPONENT24:o.type===1020?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT16:o.type===1015&&console.error(`WebGLRenderer: Floating point depth texture requires WebGL2.`),o.format===1026&&y===e.DEPTH_COMPONENT&&o.type!==1012&&o.type!==1014&&(console.warn(`THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture.`),o.type=x,v=a.convert(o.type)),o.format===1027&&y===e.DEPTH_COMPONENT&&(y=e.DEPTH_STENCIL,o.type!==1020&&(console.warn(`THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture.`),o.type=w,v=a.convert(o.type))),T&&(C?n.texStorage2D(e.TEXTURE_2D,1,y,h.width,h.height):n.texImage2D(e.TEXTURE_2D,0,y,h.width,h.height,0,_,v,null));else if(o.isDataTexture){if(S.length>0&&g){C&&T&&n.texStorage2D(e.TEXTURE_2D,M,y,S[0].width,S[0].height);for(let t=0,r=S.length;t<r;t++)b=S[t],C?n.texSubImage2D(e.TEXTURE_2D,t,0,0,b.width,b.height,_,v,b.data):n.texImage2D(e.TEXTURE_2D,t,y,b.width,b.height,0,_,v,b.data);o.generateMipmaps=!1}else C?(T&&n.texStorage2D(e.TEXTURE_2D,M,y,h.width,h.height),n.texSubImage2D(e.TEXTURE_2D,0,0,0,h.width,h.height,_,v,h.data)):n.texImage2D(e.TEXTURE_2D,0,y,h.width,h.height,0,_,v,h.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&T&&n.texStorage3D(e.TEXTURE_2D_ARRAY,M,y,S[0].width,S[0].height,h.depth);for(let t=0,r=S.length;t<r;t++)b=S[t],o.format===1023?C?n.texSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,0,b.width,b.height,h.depth,_,v,b.data):n.texImage3D(e.TEXTURE_2D_ARRAY,t,y,b.width,b.height,h.depth,0,_,v,b.data):_===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,t,0,0,0,b.width,b.height,h.depth,_,b.data,0,0):n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,t,y,b.width,b.height,h.depth,0,b.data,0,0)}else{C&&T&&n.texStorage2D(e.TEXTURE_2D,M,y,S[0].width,S[0].height);for(let t=0,r=S.length;t<r;t++)b=S[t],o.format===1023?C?n.texSubImage2D(e.TEXTURE_2D,t,0,0,b.width,b.height,_,v,b.data):n.texImage2D(e.TEXTURE_2D,t,y,b.width,b.height,0,_,v,b.data):_===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,b.width,b.height,_,b.data):n.compressedTexImage2D(e.TEXTURE_2D,t,y,b.width,b.height,0,b.data)}}else if(o.isDataArrayTexture)C?(T&&n.texStorage3D(e.TEXTURE_2D_ARRAY,M,y,h.width,h.height,h.depth),n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,h.width,h.height,h.depth,_,v,h.data)):n.texImage3D(e.TEXTURE_2D_ARRAY,0,y,h.width,h.height,h.depth,0,_,v,h.data);else if(o.isData3DTexture)C?(T&&n.texStorage3D(e.TEXTURE_3D,M,y,h.width,h.height,h.depth),n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,h.width,h.height,h.depth,_,v,h.data)):n.texImage3D(e.TEXTURE_3D,0,y,h.width,h.height,h.depth,0,_,v,h.data);else if(o.isFramebufferTexture){if(T){if(C)n.texStorage2D(e.TEXTURE_2D,M,y,h.width,h.height);else{let t=h.width,r=h.height;for(let i=0;i<M;i++)n.texImage2D(e.TEXTURE_2D,i,y,t,r,0,_,v,null),t>>=1,r>>=1}}}else if(S.length>0&&g){C&&T&&n.texStorage2D(e.TEXTURE_2D,M,y,S[0].width,S[0].height);for(let t=0,r=S.length;t<r;t++)b=S[t],C?n.texSubImage2D(e.TEXTURE_2D,t,0,0,_,v,b):n.texImage2D(e.TEXTURE_2D,t,y,_,v,b);o.generateMipmaps=!1}else C?(T&&n.texStorage2D(e.TEXTURE_2D,M,y,h.width,h.height),n.texSubImage2D(e.TEXTURE_2D,0,0,0,_,v,h)):n.texImage2D(e.TEXTURE_2D,0,y,_,v,h);k(o,g)&&A(l),f.__version=d.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function I(t,o,c){if(o.image.length!==6)return;let l=ve(t,o),u=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+c);let d=r.get(u);if(u.version!==d.__version||l===!0){n.activeTexture(e.TEXTURE0+c);let t=Ye.getPrimaries(Ye.workingColorSpace),r=o.colorSpace===``?null:Ye.getPrimaries(o.colorSpace),f=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,f);let p=o.isCompressedTexture||o.image[0].isCompressedTexture,m=o.image[0]&&o.image[0].isDataTexture,h=[];for(let e=0;e<6;e++)!p&&!m?h[e]=E(o.image[e],!1,!0,i.maxCubemapSize):h[e]=m?o.image[e].image:o.image[e],h[e]=Oe(o,h[e]);let g=h[0],_=D(g)||s,v=a.convert(o.format,o.colorSpace),y=a.convert(o.type),b=j(o.internalFormat,v,y,o.colorSpace),x=s&&o.isVideoTexture!==!0,S=d.__version===void 0||l===!0,C=ee(o,g,_);P(e.TEXTURE_CUBE_MAP,o,_);let w;if(p){x&&S&&n.texStorage2D(e.TEXTURE_CUBE_MAP,C,b,g.width,g.height);for(let t=0;t<6;t++){w=h[t].mipmaps;for(let r=0;r<w.length;r++){let i=w[r];o.format===1023?x?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,v,y,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,b,i.width,i.height,0,v,y,i.data):v===null?console.warn(`THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):x?n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,v,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,b,i.width,i.height,0,i.data)}}}else{w=o.mipmaps,x&&S&&(w.length>0&&C++,n.texStorage2D(e.TEXTURE_CUBE_MAP,C,b,h[0].width,h[0].height));for(let t=0;t<6;t++)if(m){x?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,h[t].width,h[t].height,v,y,h[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,b,h[t].width,h[t].height,0,v,y,h[t].data);for(let r=0;r<w.length;r++){let i=w[r].image[t].image;x?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,v,y,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,b,i.width,i.height,0,v,y,i.data)}}else{x?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,v,y,h[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,b,v,y,h[t]);for(let r=0;r<w.length;r++){let i=w[r];x?n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,v,y,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,b,v,y,i.image[t])}}}k(o,_)&&A(e.TEXTURE_CUBE_MAP),d.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function L(t,i,o,s,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=j(o.internalFormat,d,f,o.colorSpace);if(!r.get(i).__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Ee(i)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,s,l,r.get(o).__webglTexture,0,Te(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,s,l,r.get(o).__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function R(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer&&!n.stencilBuffer){let i=s===!0?e.DEPTH_COMPONENT24:e.DEPTH_COMPONENT16;if(r||Ee(n)){let t=n.depthTexture;t&&t.isDepthTexture&&(t.type===1015?i=e.DEPTH_COMPONENT32F:t.type===1014&&(i=e.DEPTH_COMPONENT24));let r=Te(n);Ee(n)?c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,r,i,n.width,n.height):e.renderbufferStorageMultisample(e.RENDERBUFFER,r,i,n.width,n.height)}else e.renderbufferStorage(e.RENDERBUFFER,i,n.width,n.height);e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,t)}else if(n.depthBuffer&&n.stencilBuffer){let i=Te(n);r&&Ee(n)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,i,e.DEPTH24_STENCIL8,n.width,n.height):Ee(n)?c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,i,e.DEPTH24_STENCIL8,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_STENCIL,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.RENDERBUFFER,t)}else{let t=n.isWebGLMultipleRenderTargets===!0?n.texture:[n.texture];for(let i=0;i<t.length;i++){let o=t[i],s=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=j(o.internalFormat,s,l,o.colorSpace),d=Te(n);r&&Ee(n)===!1?e.renderbufferStorageMultisample(e.RENDERBUFFER,d,u,n.width,n.height):Ee(n)?c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,d,u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function ye(t,i){if(i&&i.isWebGLCubeRenderTarget)throw Error(`Depth Texture with cube render targets is not supported`);if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`renderTarget.depthTexture must be an instance of THREE.DepthTexture`);r.get(i.depthTexture).__webglTexture&&i.depthTexture.image.width===i.width&&i.depthTexture.image.height===i.height||(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),le(i.depthTexture,0);let a=r.get(i.depthTexture).__webglTexture,o=Te(i);if(i.depthTexture.format===1026)Ee(i)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,a,0,o):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,a,0);else if(i.depthTexture.format===1027)Ee(i)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,a,0,o):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,a,0);else throw Error(`Unknown depthTexture format`)}function be(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)throw Error(`target.depthTexture not supported in Cube render targets`);ye(i.__webglFramebuffer,t)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]=e.createRenderbuffer(),R(i.__webglDepthbuffer[r],t,!1)}else n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer=e.createRenderbuffer(),R(i.__webglDepthbuffer,t,!1);n.bindFramebuffer(e.FRAMEBUFFER,null)}function xe(t,n,i){let a=r.get(t);n!==void 0&&L(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&be(t)}function Se(t){let c=t.texture,l=r.get(t),u=r.get(c);t.addEventListener(`dispose`,te),t.isWebGLMultipleRenderTargets!==!0&&(u.__webglTexture===void 0&&(u.__webglTexture=e.createTexture()),u.__version=c.version,o.memory.textures++);let d=t.isWebGLCubeRenderTarget===!0,f=t.isWebGLMultipleRenderTargets===!0,p=D(t)||s;if(d){l.__webglFramebuffer=[];for(let t=0;t<6;t++)if(s&&c.mipmaps&&c.mipmaps.length>0){l.__webglFramebuffer[t]=[];for(let n=0;n<c.mipmaps.length;n++)l.__webglFramebuffer[t][n]=e.createFramebuffer()}else l.__webglFramebuffer[t]=e.createFramebuffer()}else{if(s&&c.mipmaps&&c.mipmaps.length>0){l.__webglFramebuffer=[];for(let t=0;t<c.mipmaps.length;t++)l.__webglFramebuffer[t]=e.createFramebuffer()}else l.__webglFramebuffer=e.createFramebuffer();if(f){if(i.drawBuffers){let n=t.texture;for(let t=0,i=n.length;t<i;t++){let i=r.get(n[t]);i.__webglTexture===void 0&&(i.__webglTexture=e.createTexture(),o.memory.textures++)}}else console.warn(`THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.`)}if(s&&t.samples>0&&Ee(t)===!1){let r=f?c:[c];l.__webglMultisampledFramebuffer=e.createFramebuffer(),l.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,l.__webglMultisampledFramebuffer);for(let n=0;n<r.length;n++){let i=r[n];l.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,l.__webglColorRenderbuffer[n]);let o=a.convert(i.format,i.colorSpace),s=a.convert(i.type),c=j(i.internalFormat,o,s,i.colorSpace,t.isXRRenderTarget===!0),u=Te(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,l.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(l.__webglDepthRenderbuffer=e.createRenderbuffer(),R(l.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(d){n.bindTexture(e.TEXTURE_CUBE_MAP,u.__webglTexture),P(e.TEXTURE_CUBE_MAP,c,p);for(let n=0;n<6;n++)if(s&&c.mipmaps&&c.mipmaps.length>0)for(let r=0;r<c.mipmaps.length;r++)L(l.__webglFramebuffer[n][r],t,c,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else L(l.__webglFramebuffer[n],t,c,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);k(c,p)&&A(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(f){let i=t.texture;for(let a=0,o=i.length;a<o;a++){let o=i[a],s=r.get(o);n.bindTexture(e.TEXTURE_2D,s.__webglTexture),P(e.TEXTURE_2D,o,p),L(l.__webglFramebuffer,t,o,e.COLOR_ATTACHMENT0+a,e.TEXTURE_2D,0),k(o,p)&&A(e.TEXTURE_2D)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(s?r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY:console.error(`THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.`)),n.bindTexture(r,u.__webglTexture),P(r,c,p),s&&c.mipmaps&&c.mipmaps.length>0)for(let n=0;n<c.mipmaps.length;n++)L(l.__webglFramebuffer[n],t,c,e.COLOR_ATTACHMENT0,r,n);else L(l.__webglFramebuffer,t,c,e.COLOR_ATTACHMENT0,r,0);k(c,p)&&A(r),n.unbindTexture()}t.depthBuffer&&be(t)}function Ce(t){let i=D(t)||s,a=t.isWebGLMultipleRenderTargets===!0?t.texture:[t.texture];for(let o=0,s=a.length;o<s;o++){let s=a[o];if(k(s,i)){let i=t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:e.TEXTURE_2D,a=r.get(s).__webglTexture;n.bindTexture(i,a),A(i),n.unbindTexture()}}}function we(t){if(s&&t.samples>0&&Ee(t)===!1){let i=t.isWebGLMultipleRenderTargets?t.texture:[t.texture],a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,c=[],u=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,d=r.get(t),f=t.isWebGLMultipleRenderTargets===!0;if(f)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,d.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,d.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,d.__webglMultisampledFramebuffer),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,d.__webglFramebuffer);for(let n=0;n<i.length;n++){c.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&c.push(u);let p=d.__ignoreDepthValues!==void 0&&d.__ignoreDepthValues;if(p===!1&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),f&&e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,d.__webglColorRenderbuffer[n]),p===!0&&(e.invalidateFramebuffer(e.READ_FRAMEBUFFER,[u]),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[u])),f){let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),l&&e.invalidateFramebuffer(e.READ_FRAMEBUFFER,c)}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),f)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,d.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,d.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,d.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,d.__webglMultisampledFramebuffer)}}function Te(e){return Math.min(i.maxSamples,e.samples)}function Ee(e){let n=r.get(e);return s&&e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function De(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Oe(e,n){let r=e.colorSpace,i=e.format,a=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||e.format===1035||r!==`srgb-linear`&&r!==``&&(Ye.getTransfer(r)===`srgb`?s===!1?t.has(`EXT_sRGB`)===!0&&i===1023?(e.format=he,e.minFilter=_,e.generateMipmaps=!1):n=$e.sRGBToLinear(n):(i!==1023||a!==1009)&&console.warn(`THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):console.error(`THREE.WebGLTextures: Unsupported texture color space:`,r)),n}this.allocateTextureUnit=se,this.resetTextureUnits=oe,this.setTexture2D=le,this.setTexture2DArray=de,this.setTexture3D=fe,this.setTextureCube=pe,this.rebindTextures=xe,this.setupRenderTarget=Se,this.updateRenderTargetMipmap=Ce,this.updateMultisampleRenderTarget=we,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=L,this.useMultisampledRTT=Ee}function Oo(e,t,n){let r=n.isWebGL2;function i(n,i=``){let a,o=Ye.getTransfer(i);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return r?e.HALF_FLOAT:(a=t.get(`OES_texture_half_float`),a===null?null:a.HALF_FLOAT_OES);if(n===1021)return e.ALPHA;if(n===1023)return e.RGBA;if(n===1024)return e.LUMINANCE;if(n===1025)return e.LUMINANCE_ALPHA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1035)return a=t.get(`EXT_sRGB`),a===null?null:a.SRGB_ALPHA_EXT;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(o===`srgb`){if(a=t.get(`WEBGL_compressed_texture_s3tc_srgb`),a!==null){if(n===33776)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(a=t.get(`WEBGL_compressed_texture_s3tc`),a!==null){if(n===33776)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(a=t.get(`WEBGL_compressed_texture_pvrtc`),a!==null){if(n===35840)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196)return a=t.get(`WEBGL_compressed_texture_etc1`),a===null?null:a.COMPRESSED_RGB_ETC1_WEBGL;if(n===37492||n===37496){if(a=t.get(`WEBGL_compressed_texture_etc`),a!==null){if(n===37492)return o===`srgb`?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===37496)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(a=t.get(`WEBGL_compressed_texture_astc`),a!==null){if(n===37808)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return o===`srgb`?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(a=t.get(`EXT_texture_compression_bptc`),a!==null){if(n===36492)return o===`srgb`?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(a=t.get(`EXT_texture_compression_rgtc`),a!==null){if(n===36492)return a.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?r?e.UNSIGNED_INT_24_8:(a=t.get(`WEBGL_depth_texture`),a===null?null:a.UNSIGNED_INT_24_8_WEBGL):e[n]===void 0?null:e[n]}return{convert:i}}var ko=class extends Sr{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},Ao=class extends dn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},jo={type:`move`},Mo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ao,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ao,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ao,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(jo)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Ao;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},No=class extends _e{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=t.getContextAttributes(),h=null,g=null,_=[],v=[],y=new B,S=null,C=new Sr;C.layers.enable(1),C.viewport=new at;let O=new Sr;O.layers.enable(2),O.viewport=new at;let k=[C,O],A=new ko;A.layers.enable(1),A.layers.enable(2);let j=null,ee=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=_[e];return t===void 0&&(t=new Mo,_[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=_[e];return t===void 0&&(t=new Mo,_[e]=t),t.getGripSpace()},this.getHand=function(e){let t=_[e];return t===void 0&&(t=new Mo,_[e]=t),t.getHandSpace()};function M(e){let t=v.indexOf(e.inputSource);if(t===-1)return;let n=_[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function N(){r.removeEventListener(`select`,M),r.removeEventListener(`selectstart`,M),r.removeEventListener(`selectend`,M),r.removeEventListener(`squeeze`,M),r.removeEventListener(`squeezestart`,M),r.removeEventListener(`squeezeend`,M),r.removeEventListener(`end`,N),r.removeEventListener(`inputsourceschange`,te);for(let e=0;e<_.length;e++){let t=v[e];t!==null&&(v[e]=null,_[e].disconnect(t))}j=null,ee=null,e.setRenderTarget(h),f=null,d=null,u=null,r=null,g=null,le.stop(),n.isPresenting=!1,e.setPixelRatio(S),e.setSize(y.width,y.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&console.warn(`THREE.WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(h=e.getRenderTarget(),r.addEventListener(`select`,M),r.addEventListener(`selectstart`,M),r.addEventListener(`selectend`,M),r.addEventListener(`squeeze`,M),r.addEventListener(`squeezestart`,M),r.addEventListener(`squeezeend`,M),r.addEventListener(`end`,N),r.addEventListener(`inputsourceschange`,te),m.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(y),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){let n={antialias:r.renderState.layers!==void 0||m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),g=new st(f.framebufferWidth,f.framebufferHeight,{format:T,type:b,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let n=null,a=null,o=null;m.depth&&(o=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=m.stencil?D:E,a=m.stencil?w:x);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=new XRWebGLBinding(r,t),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),g=new st(d.textureWidth,d.textureHeight,{format:T,type:b,depthTexture:new xi(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0});let c=e.properties.get(g);c.__ignoreDepthValues=d.ignoreDepthValues}g.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),le.setContext(r),le.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function te(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=v.indexOf(n);r>=0&&(v[r]=null,_[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=v.indexOf(n);if(r===-1){for(let e=0;e<_.length;e++)if(e>=v.length){v.push(n),r=e;break}else if(v[e]===null){v[e]=n,r=e;break}if(r===-1)break}let i=_[r];i&&i.connect(n)}}let ne=new H,re=new H;function ie(e,t,n){ne.setFromMatrixPosition(t.matrixWorld),re.setFromMatrixPosition(n.matrixWorld);let r=ne.distanceTo(re),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert();let g=o+m,_=s+m,v=f-h,y=p+(r-h),b=c*s/_*g,x=l*s/_*g;e.projectionMatrix.makePerspective(v,y,b,x,g,_),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}function ae(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;A.near=O.near=C.near=e.near,A.far=O.far=C.far=e.far,(j!==A.near||ee!==A.far)&&(r.updateRenderState({depthNear:A.near,depthFar:A.far}),j=A.near,ee=A.far);let t=e.parent,n=A.cameras;ae(A,t);for(let e=0;e<n.length;e++)ae(n[e],t);n.length===2?ie(A,C,O):A.projectionMatrix.copy(C.projectionMatrix),oe(e,A,t)};function oe(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=I*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)};let se=null;function ce(t,r){if(l=r.getViewerPose(c||a),p=r,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(g,f.framebuffer),e.setRenderTarget(g));let n=!1;t.length!==A.cameras.length&&(A.cameras.length=0,n=!0);for(let r=0;r<t.length;r++){let i=t[r],a=null;if(f!==null)a=f.getViewport(i);else{let t=u.getViewSubImage(d,i);a=t.viewport,r===0&&(e.setRenderTargetTextures(g,t.colorTexture,d.ignoreDepthValues?void 0:t.depthStencilTexture),e.setRenderTarget(g))}let o=k[r];o===void 0&&(o=new Sr,o.layers.enable(r),o.viewport=new at,k[r]=o),o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(i.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),r===0&&(A.matrix.copy(o.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),n===!0&&A.cameras.push(o)}}for(let e=0;e<_.length;e++){let t=v[e],n=_[e];t!==null&&n!==void 0&&n.update(t,r,c||a)}se&&se(t,r),r.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:r}),p=null}let le=new Fr;le.setAnimationLoop(ce),this.setAnimationLoop=function(e){se=e},this.dispose=function(){}}};function Po(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,gr(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isMeshBasicMaterial||t.isMeshLambertMaterial?a(e,t):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(r,i){r.opacity.value=i.opacity,i.color&&r.diffuse.value.copy(i.color),i.emissive&&r.emissive.value.copy(i.emissive).multiplyScalar(i.emissiveIntensity),i.map&&(r.map.value=i.map,n(i.map,r.mapTransform)),i.alphaMap&&(r.alphaMap.value=i.alphaMap,n(i.alphaMap,r.alphaMapTransform)),i.bumpMap&&(r.bumpMap.value=i.bumpMap,n(i.bumpMap,r.bumpMapTransform),r.bumpScale.value=i.bumpScale,i.side===1&&(r.bumpScale.value*=-1)),i.normalMap&&(r.normalMap.value=i.normalMap,n(i.normalMap,r.normalMapTransform),r.normalScale.value.copy(i.normalScale),i.side===1&&r.normalScale.value.negate()),i.displacementMap&&(r.displacementMap.value=i.displacementMap,n(i.displacementMap,r.displacementMapTransform),r.displacementScale.value=i.displacementScale,r.displacementBias.value=i.displacementBias),i.emissiveMap&&(r.emissiveMap.value=i.emissiveMap,n(i.emissiveMap,r.emissiveMapTransform)),i.specularMap&&(r.specularMap.value=i.specularMap,n(i.specularMap,r.specularMapTransform)),i.alphaTest>0&&(r.alphaTest.value=i.alphaTest);let a=t.get(i).envMap;if(a&&(r.envMap.value=a,r.flipEnvMap.value=a.isCubeTexture&&a.isRenderTargetTexture===!1?-1:1,r.reflectivity.value=i.reflectivity,r.ior.value=i.ior,r.refractionRatio.value=i.refractionRatio),i.lightMap){r.lightMap.value=i.lightMap;let t=e._useLegacyLights===!0?Math.PI:1;r.lightMapIntensity.value=i.lightMapIntensity*t,n(i.lightMap,r.lightMapTransform)}i.aoMap&&(r.aoMap.value=i.aoMap,r.aoMapIntensity.value=i.aoMapIntensity,n(i.aoMap,r.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,r){e.metalness.value=r.metalness,r.metalnessMap&&(e.metalnessMap.value=r.metalnessMap,n(r.metalnessMap,e.metalnessMapTransform)),e.roughness.value=r.roughness,r.roughnessMap&&(e.roughnessMap.value=r.roughnessMap,n(r.roughnessMap,e.roughnessMapTransform)),t.get(r).envMap&&(e.envMapIntensity.value=r.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Fo(e,t,n,r){let i={},a={},o=[],s=n.isWebGL2?e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(m(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return console.error(`THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let t=0,n=r.length;t<n;t++){let n=Array.isArray(r[t])?r[t]:[r[t]];for(let r=0,i=n.length;r<i;r++){let i=n[r];if(p(i,t,r,a)===!0){let t=i.__offset,n=Array.isArray(i.value)?i.value:[i.value],r=0;for(let a=0;a<n.length;a++){let o=n[a],s=h(o);typeof o==`number`||typeof o==`boolean`?(i.__data[0]=o,e.bufferSubData(e.UNIFORM_BUFFER,t+r,i.__data)):o.isMatrix3?(i.__data[0]=o.elements[0],i.__data[1]=o.elements[1],i.__data[2]=o.elements[2],i.__data[3]=0,i.__data[4]=o.elements[3],i.__data[5]=o.elements[4],i.__data[6]=o.elements[5],i.__data[7]=0,i.__data[8]=o.elements[6],i.__data[9]=o.elements[7],i.__data[10]=o.elements[8],i.__data[11]=0):(o.toArray(i.__data,r),r+=s.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,t,i.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=h(r),o=n%16;o!==0&&16-o<a.boundary&&(n+=16-o),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?console.warn(`THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.`):console.warn(`THREE.WebGLRenderer: Unsupported uniform value type.`,e),t}function g(t){let n=t.target;n.removeEventListener(`dispose`,g);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:_}}var Io=class{constructor(e={}){let{canvas:t=He(),context:n=null,depth:r=!0,stencil:i=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let d;d=n===null?a:n.getContextAttributes().alpha;let f=new Uint32Array(4),p=new Int32Array(4),m=null,h=null,g=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=oe,this._useLegacyLights=!1,this.toneMapping=0,this.toneMappingExposure=1;let v=this,x=!1,S=0,w=0,T=null,E=-1,D=null,O=new at,k=new at,A=null,j=new W(0),ee=0,M=t.width,N=t.height,te=1,ne=null,re=null,ie=new at(0,0,M,N),ae=new at(0,0,M,N),ce=!1,le=new Pr,ue=!1,de=!1,fe=null,pe=new U,me=new B,he=new H,ge={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function _e(){return T===null?te:1}let P=n;function ve(e,n){for(let r=0;r<e.length;r++){let i=e[r],a=t.getContext(i,n);if(a!==null)return a}return null}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r160`),t.addEventListener(`webglcontextlost`,Be,!1),t.addEventListener(`webglcontextrestored`,Ve,!1),t.addEventListener(`webglcontextcreationerror`,Ue,!1),P===null){let t=[`webgl2`,`webgl`,`experimental-webgl`];if(v.isWebGL1Renderer===!0&&t.shift(),P=ve(t,e),P===null)throw ve(t)?Error(`Error creating WebGL context with your selected attributes.`):Error(`Error creating WebGL context.`)}typeof WebGLRenderingContext<`u`&&P instanceof WebGLRenderingContext&&console.warn(`THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163.`),P.getShaderPrecisionFormat===void 0&&(P.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(e){throw console.error(`THREE.WebGLRenderer: `+e.message),e}let F,I,L,R,ye,be,xe,Se,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Ie,Le,z,Re;function V(){F=new pi(P),I=new Ur(P,F,e),F.init(I),Le=new Oo(P,F,I),L=new Eo(P,F,I),R=new gi(P),ye=new co,be=new Do(P,F,L,ye,I,Le,R),xe=new Gr(v),Se=new fi(v),Ce=new Ir(P,I),z=new Vr(P,F,Ce,I),we=new mi(P,Ce,R,z),Te=new bi(P,we,Ce,R),Ne=new yi(P,I,be),Ae=new Wr(ye),Ee=new so(v,xe,Se,F,I,z,Ae),De=new Po(v,ye),Oe=new po,ke=new bo(F,I),Me=new Br(v,xe,Se,L,Te,d,s),je=new To(v,Te,I),Re=new Fo(P,R,I,L),Pe=new Hr(P,F,R,I),Ie=new hi(P,F,R,I),R.programs=Ee.programs,v.capabilities=I,v.extensions=F,v.properties=ye,v.renderLists=Oe,v.shadowMap=je,v.state=L,v.info=R}V();let ze=new No(v,P);this.xr=ze,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let e=F.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=F.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(e){e!==void 0&&(te=e,this.setSize(M,N,!1))},this.getSize=function(e){return e.set(M,N)},this.setSize=function(e,n,r=!0){ze.isPresenting?console.warn(`THREE.WebGLRenderer: Can't change size while VR device is presenting.`):(M=e,N=n,t.width=Math.floor(e*te),t.height=Math.floor(n*te),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(M*te,N*te).floor()},this.setDrawingBufferSize=function(e,n,r){M=e,N=n,te=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.getCurrentViewport=function(e){return e.copy(O)},this.getViewport=function(e){return e.copy(ie)},this.setViewport=function(e,t,n,r){e.isVector4?ie.set(e.x,e.y,e.z,e.w):ie.set(e,t,n,r),L.viewport(O.copy(ie).multiplyScalar(te).floor())},this.getScissor=function(e){return e.copy(ae)},this.setScissor=function(e,t,n,r){e.isVector4?ae.set(e.x,e.y,e.z,e.w):ae.set(e,t,n,r),L.scissor(k.copy(ae).multiplyScalar(te).floor())},this.getScissorTest=function(){return ce},this.setScissorTest=function(e){L.setScissorTest(ce=e)},this.setOpaqueSort=function(e){ne=e},this.setTransparentSort=function(e){re=e},this.getClearColor=function(e){return e.copy(Me.getClearColor())},this.setClearColor=function(){Me.setClearColor.apply(Me,arguments)},this.getClearAlpha=function(){return Me.getClearAlpha()},this.setClearAlpha=function(){Me.setClearAlpha.apply(Me,arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(T!==null){let t=T.texture.format;e=t===1033||t===1031||t===1029}if(e){let e=T.texture.type,t=e===1009||e===1014||e===1012||e===1020||e===1017||e===1018,n=Me.getClearColor(),r=Me.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(f[0]=i,f[1]=a,f[2]=o,f[3]=r,P.clearBufferuiv(P.COLOR,0,f)):(p[0]=i,p[1]=a,p[2]=o,p[3]=r,P.clearBufferiv(P.COLOR,0,p))}else r|=P.COLOR_BUFFER_BIT}t&&(r|=P.DEPTH_BUFFER_BIT),n&&(r|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Be,!1),t.removeEventListener(`webglcontextrestored`,Ve,!1),t.removeEventListener(`webglcontextcreationerror`,Ue,!1),Oe.dispose(),ke.dispose(),ye.dispose(),xe.dispose(),Se.dispose(),Te.dispose(),z.dispose(),Re.dispose(),Ee.dispose(),ze.dispose(),ze.removeEventListener(`sessionstart`,Xe),ze.removeEventListener(`sessionend`,Ze),fe&&=(fe.dispose(),null),Qe.stop()};function Be(e){e.preventDefault(),console.log(`THREE.WebGLRenderer: Context Lost.`),x=!0}function Ve(){console.log(`THREE.WebGLRenderer: Context Restored.`),x=!1;let e=R.autoReset,t=je.enabled,n=je.autoUpdate,r=je.needsUpdate,i=je.type;V(),R.autoReset=e,je.enabled=t,je.autoUpdate=n,je.needsUpdate=r,je.type=i}function Ue(e){console.error(`THREE.WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function We(e){let t=e.target;t.removeEventListener(`dispose`,We),Ge(t)}function Ge(e){Ke(e),ye.remove(e)}function Ke(e){let t=ye.get(e).programs;t!==void 0&&(t.forEach(function(e){Ee.releaseProgram(e)}),e.isShaderMaterial&&Ee.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ge);let o=i.isMesh&&i.matrixWorld.determinant()<0,s=lt(e,t,n,r,i);L.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=we.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;z.setup(i,r,s,n,c);let h,g=Pe;if(c!==null&&(h=Ce.get(c),g=Ie,g.setIndex(h)),i.isMesh)r.wireframe===!0?(L.setLineWidth(r.wireframeLinewidth*_e()),g.setMode(P.LINES)):g.setMode(P.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),L.setLineWidth(e*_e()),i.isLineSegments?g.setMode(P.LINES):i.isLineLoop?g.setMode(P.LINE_LOOP):g.setMode(P.LINE_STRIP)}else i.isPoints?g.setMode(P.POINTS):i.isSprite&&g.setMode(P.TRIANGLES);if(i.isBatchedMesh)g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function qe(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,it(e,t,n),e.side=0,e.needsUpdate=!0,it(e,t,n),e.side=2):it(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),h=ke.get(n),h.init(),_.push(h),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(h.pushLight(e),e.castShadow&&h.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(h.pushLight(e),e.castShadow&&h.pushShadow(e))}),h.setupLights(v._useLegacyLights);let r=new Set;return e.traverse(function(e){let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];qe(a,n,e),r.add(a)}else qe(t,n,e),r.add(t)}}),_.pop(),h=null,r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){ye.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}F.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let Je=null;function Ye(e){Je&&Je(e)}function Xe(){Qe.stop()}function Ze(){Qe.start()}let Qe=new Fr;Qe.setAnimationLoop(Ye),typeof self<`u`&&Qe.setContext(self),this.setAnimationLoop=function(e){Je=e,ze.setAnimationLoop(e),e===null?Qe.stop():Qe.start()},ze.addEventListener(`sessionstart`,Xe),ze.addEventListener(`sessionend`,Ze),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){console.error(`THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(x===!0)return;e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ze.enabled===!0&&ze.isPresenting===!0&&(ze.cameraAutoUpdate===!0&&ze.updateCamera(t),t=ze.getCamera()),e.isScene===!0&&e.onBeforeRender(v,e,t,T),h=ke.get(e,_.length),h.init(),_.push(h),pe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),le.setFromProjectionMatrix(pe),de=this.localClippingEnabled,ue=Ae.init(this.clippingPlanes,de),m=Oe.get(e,g.length),m.init(),g.push(m),$e(e,t,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(ne,re),this.info.render.frame++,ue===!0&&Ae.beginShadows();let n=h.state.shadowsArray;if(je.render(n,e,t),ue===!0&&Ae.endShadows(),this.info.autoReset===!0&&this.info.reset(),Me.render(m,e),h.setupLights(v._useLegacyLights),t.isArrayCamera){let n=t.cameras;for(let t=0,r=n.length;t<r;t++){let r=n[t];et(m,e,r,r.viewport)}}else et(m,e,t);T!==null&&(be.updateMultisampleRenderTarget(T),be.updateRenderTargetMipmap(T)),e.isScene===!0&&e.onAfterRender(v,e,t),z.resetDefaultState(),E=-1,D=null,_.pop(),h=_.length>0?_[_.length-1]:null,g.pop(),m=g.length>0?g[g.length-1]:null};function $e(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)h.pushLight(e),e.castShadow&&h.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||le.intersectsSprite(e)){r&&he.setFromMatrixPosition(e.matrixWorld).applyMatrix4(pe);let t=Te.update(e),i=e.material;i.visible&&m.push(e,t,i,n,he.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||le.intersectsObject(e))){let t=Te.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),he.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),he.copy(e.boundingSphere.center)),he.applyMatrix4(e.matrixWorld).applyMatrix4(pe)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&m.push(e,t,s,n,he.z,o)}}else i.visible&&m.push(e,t,i,n,he.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)$e(i[e],t,n,r)}function et(e,t,n,r){let i=e.opaque,a=e.transmissive,o=e.transparent;h.setupLightsView(n),ue===!0&&Ae.setGlobalState(v.clippingPlanes,n),a.length>0&&tt(i,a,t,n),r&&L.viewport(O.copy(r)),i.length>0&&nt(i,t,n),a.length>0&&nt(a,t,n),o.length>0&&nt(o,t,n),L.buffers.depth.setTest(!0),L.buffers.depth.setMask(!0),L.buffers.color.setMask(!0),L.setPolygonOffset(!1)}function tt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;let i=I.isWebGL2;fe===null&&(fe=new st(1,1,{generateMipmaps:!0,type:F.has(`EXT_color_buffer_half_float`)?C:b,minFilter:y,samples:i?4:0})),v.getDrawingBufferSize(me),i?fe.setSize(me.x,me.y):fe.setSize(Fe(me.x),Fe(me.y));let a=v.getRenderTarget();v.setRenderTarget(fe),v.getClearColor(j),ee=v.getClearAlpha(),ee<1&&v.setClearColor(16777215,.5),v.clear();let o=v.toneMapping;v.toneMapping=0,nt(e,n,r),be.updateMultisampleRenderTarget(fe),be.updateRenderTargetMipmap(fe);let s=!1;for(let e=0,i=t.length;e<i;e++){let i=t[e],a=i.object,o=i.geometry,c=i.material,l=i.group;if(c.side===2&&a.layers.test(r.layers)){let e=c.side;c.side=1,c.needsUpdate=!0,rt(a,n,r,o,c,l),c.side=e,c.needsUpdate=!0,s=!0}}s===!0&&(be.updateMultisampleRenderTarget(fe),be.updateRenderTargetMipmap(fe)),v.setRenderTarget(a),v.setClearColor(j,ee),v.toneMapping=o}function nt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],o=a.object,s=a.geometry,c=r===null?a.material:r,l=a.group;o.layers.test(n.layers)&&rt(o,t,n,s,c,l)}}function rt(e,t,n,r,i,a){e.onBeforeRender(v,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(v,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,v.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,v.renderBufferDirect(n,t,r,i,e,a),i.side=2):v.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(v,t,n,r,i,a)}function it(e,t,n){t.isScene!==!0&&(t=ge);let r=ye.get(e),i=h.state.lights,a=h.state.shadowsArray,o=i.state.version,s=Ee.getParameters(e,i.state,a,t,n),c=Ee.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial?t.environment:null,r.fog=t.fog,r.envMap=(e.isMeshStandardMaterial?Se:xe).get(e.envMap||r.environment),l===void 0&&(e.addEventListener(`dispose`,We),l=new Map,r.programs=l);let u=l.get(c);if(u!==void 0){if(r.currentProgram===u&&r.lightsStateVersion===o)return ct(e,s),u}else s.uniforms=Ee.getUniforms(e),e.onBuild(n,s,v),e.onBeforeCompile(s,v),u=Ee.acquireProgram(s,c),l.set(c,u),r.uniforms=s.uniforms;let d=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(d.clippingPlanes=Ae.uniform),ct(e,s),r.needsLights=dt(e),r.lightsStateVersion=o,r.needsLights&&(d.ambientLightColor.value=i.state.ambient,d.lightProbe.value=i.state.probe,d.directionalLights.value=i.state.directional,d.directionalLightShadows.value=i.state.directionalShadow,d.spotLights.value=i.state.spot,d.spotLightShadows.value=i.state.spotShadow,d.rectAreaLights.value=i.state.rectArea,d.ltc_1.value=i.state.rectAreaLTC1,d.ltc_2.value=i.state.rectAreaLTC2,d.pointLights.value=i.state.point,d.pointLightShadows.value=i.state.pointShadow,d.hemisphereLights.value=i.state.hemi,d.directionalShadowMap.value=i.state.directionalShadowMap,d.directionalShadowMatrix.value=i.state.directionalShadowMatrix,d.spotShadowMap.value=i.state.spotShadowMap,d.spotLightMatrix.value=i.state.spotLightMatrix,d.spotLightMap.value=i.state.spotLightMap,d.pointShadowMap.value=i.state.pointShadowMap,d.pointShadowMatrix.value=i.state.pointShadowMatrix),r.currentProgram=u,r.uniformsList=null,u}function ot(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Oa.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function ct(e,t){let n=ye.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function lt(e,t,n,r,i){t.isScene!==!0&&(t=ge),be.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial?t.environment:null,s=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:se,c=(r.isMeshStandardMaterial?Se:xe).get(r.envMap||o),l=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,u=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),d=!!n.morphAttributes.position,f=!!n.morphAttributes.normal,p=!!n.morphAttributes.color,m=0;r.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(m=v.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,y=ye.get(r),b=h.state.lights;if(ue===!0&&(de===!0||e!==D)){let t=e===D&&r.id===E;Ae.setState(r,e,t)}let x=!1;r.version===y.__version?y.needsLights&&y.lightsStateVersion!==b.state.version?x=!0:y.outputColorSpace===s?i.isBatchedMesh&&y.batching===!1||!i.isBatchedMesh&&y.batching===!0||i.isInstancedMesh&&y.instancing===!1||!i.isInstancedMesh&&y.instancing===!0||i.isSkinnedMesh&&y.skinning===!1||!i.isSkinnedMesh&&y.skinning===!0||i.isInstancedMesh&&y.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&y.instancingColor===!1&&i.instanceColor!==null?x=!0:y.envMap===c?r.fog===!0&&y.fog!==a||y.numClippingPlanes!==void 0&&(y.numClippingPlanes!==Ae.numPlanes||y.numIntersection!==Ae.numIntersection)?x=!0:y.vertexAlphas===l&&y.vertexTangents===u&&y.morphTargets===d&&y.morphNormals===f&&y.morphColors===p&&y.toneMapping===m?I.isWebGL2===!0&&y.morphTargetsCount!==_&&(x=!0):x=!0:x=!0:x=!0:(x=!0,y.__version=r.version);let S=y.currentProgram;x===!0&&(S=it(r,t,i));let C=!1,w=!1,O=!1,k=S.getUniforms(),A=y.uniforms;if(L.useProgram(S.program)&&(C=!0,w=!0,O=!0),r.id!==E&&(E=r.id,w=!0),C||D!==e){k.setValue(P,`projectionMatrix`,e.projectionMatrix),k.setValue(P,`viewMatrix`,e.matrixWorldInverse);let t=k.map.cameraPosition;t!==void 0&&t.setValue(P,he.setFromMatrixPosition(e.matrixWorld)),I.logarithmicDepthBuffer&&k.setValue(P,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&k.setValue(P,`isOrthographic`,e.isOrthographicCamera===!0),D!==e&&(D=e,w=!0,O=!0)}if(i.isSkinnedMesh){k.setOptional(P,i,`bindMatrix`),k.setOptional(P,i,`bindMatrixInverse`);let e=i.skeleton;e&&(I.floatVertexTextures?(e.boneTexture===null&&e.computeBoneTexture(),k.setValue(P,`boneTexture`,e.boneTexture,be)):console.warn(`THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required.`))}i.isBatchedMesh&&(k.setOptional(P,i,`batchingTexture`),k.setValue(P,`batchingTexture`,i._matricesTexture,be));let j=n.morphAttributes;if((j.position!==void 0||j.normal!==void 0||j.color!==void 0&&I.isWebGL2===!0)&&Ne.update(i,n,S),(w||y.receiveShadow!==i.receiveShadow)&&(y.receiveShadow=i.receiveShadow,k.setValue(P,`receiveShadow`,i.receiveShadow)),r.isMeshGouraudMaterial&&r.envMap!==null&&(A.envMap.value=c,A.flipEnvMap.value=c.isCubeTexture&&c.isRenderTargetTexture===!1?-1:1),w&&(k.setValue(P,`toneMappingExposure`,v.toneMappingExposure),y.needsLights&&ut(A,O),a&&r.fog===!0&&De.refreshFogUniforms(A,a),De.refreshMaterialUniforms(A,r,te,N,fe),Oa.upload(P,ot(y),A,be)),r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Oa.upload(P,ot(y),A,be),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&k.setValue(P,`center`,i.center),k.setValue(P,`modelViewMatrix`,i.modelViewMatrix),k.setValue(P,`normalMatrix`,i.normalMatrix),k.setValue(P,`modelMatrix`,i.matrixWorld),r.isShaderMaterial||r.isRawShaderMaterial){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++)if(I.isWebGL2){let n=e[t];Re.update(n,S),Re.bind(n,S)}else console.warn(`THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.`)}return S}function ut(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function dt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(e,t,n){ye.get(e.texture).__webglTexture=t,ye.get(e.depthTexture).__webglTexture=n;let r=ye.get(e);r.__hasExternalTextures=!0,r.__hasExternalTextures&&(r.__autoAllocateDepthBuffer=n===void 0,r.__autoAllocateDepthBuffer||F.has(`WEBGL_multisampled_render_to_texture`)===!0&&(console.warn(`THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided`),r.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(e,t){let n=ye.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){T=e,S=t,w=n;let r=!0,i=null,a=!1,o=!1;if(e){let s=ye.get(e);s.__useDefaultFramebuffer===void 0?s.__webglFramebuffer===void 0?be.setupRenderTarget(e):s.__hasExternalTextures&&be.rebindTextures(e,ye.get(e.texture).__webglTexture,ye.get(e.depthTexture).__webglTexture):(L.bindFramebuffer(P.FRAMEBUFFER,null),r=!1);let c=e.texture;(c.isData3DTexture||c.isDataArrayTexture||c.isCompressedArrayTexture)&&(o=!0);let l=ye.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(i=Array.isArray(l[t])?l[t][n]:l[t],a=!0):i=I.isWebGL2&&e.samples>0&&be.useMultisampledRTT(e)===!1?ye.get(e).__webglMultisampledFramebuffer:Array.isArray(l)?l[n]:l,O.copy(e.viewport),k.copy(e.scissor),A=e.scissorTest}else O.copy(ie).multiplyScalar(te).floor(),k.copy(ae).multiplyScalar(te).floor(),A=ce;if(L.bindFramebuffer(P.FRAMEBUFFER,i)&&I.drawBuffers&&r&&L.drawBuffers(e,i),L.viewport(O),L.scissor(k),L.setScissorTest(A),a){let r=ye.get(e.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(o){let r=ye.get(e.texture),i=t||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,r.__webglTexture,n||0,i)}E=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o){if(!(e&&e.isWebGLRenderTarget)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let s=ye.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(s=s[o]),s){L.bindFramebuffer(P.FRAMEBUFFER,s);try{let o=e.texture,s=o.format,c=o.type;if(s!==1023&&Le.convert(s)!==P.getParameter(P.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}let l=c===1016&&(F.has(`EXT_color_buffer_half_float`)||I.isWebGL2&&F.has(`EXT_color_buffer_float`));if(c!==1009&&Le.convert(c)!==P.getParameter(P.IMPLEMENTATION_COLOR_READ_TYPE)&&!(c===1015&&(I.isWebGL2||F.has(`OES_texture_float`)||F.has(`WEBGL_color_buffer_float`)))&&!l){console.error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&P.readPixels(t,n,r,i,Le.convert(s),Le.convert(c),a)}finally{let e=T===null?null:ye.get(T).__webglFramebuffer;L.bindFramebuffer(P.FRAMEBUFFER,e)}}},this.copyFramebufferToTexture=function(e,t,n=0){let r=2**-n,i=Math.floor(t.image.width*r),a=Math.floor(t.image.height*r);be.setTexture2D(t,0),P.copyTexSubImage2D(P.TEXTURE_2D,n,0,0,e.x,e.y,i,a),L.unbindTexture()},this.copyTextureToTexture=function(e,t,n,r=0){let i=t.image.width,a=t.image.height,o=Le.convert(n.format),s=Le.convert(n.type);be.setTexture2D(n,0),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,n.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,n.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,n.unpackAlignment),t.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,r,e.x,e.y,i,a,o,s,t.image.data):t.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,r,e.x,e.y,t.mipmaps[0].width,t.mipmaps[0].height,o,t.mipmaps[0].data):P.texSubImage2D(P.TEXTURE_2D,r,e.x,e.y,o,s,t.image),r===0&&n.generateMipmaps&&P.generateMipmap(P.TEXTURE_2D),L.unbindTexture()},this.copyTextureToTexture3D=function(e,t,n,r,i=0){if(v.isWebGL1Renderer){console.warn(`THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.`);return}let a=e.max.x-e.min.x+1,o=e.max.y-e.min.y+1,s=e.max.z-e.min.z+1,c=Le.convert(r.format),l=Le.convert(r.type),u;if(r.isData3DTexture)be.setTexture3D(r,0),u=P.TEXTURE_3D;else if(r.isDataArrayTexture||r.isCompressedArrayTexture)be.setTexture2DArray(r,0),u=P.TEXTURE_2D_ARRAY;else{console.warn(`THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.`);return}P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,r.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,r.unpackAlignment);let d=P.getParameter(P.UNPACK_ROW_LENGTH),f=P.getParameter(P.UNPACK_IMAGE_HEIGHT),p=P.getParameter(P.UNPACK_SKIP_PIXELS),m=P.getParameter(P.UNPACK_SKIP_ROWS),h=P.getParameter(P.UNPACK_SKIP_IMAGES),g=n.isCompressedTexture?n.mipmaps[i]:n.image;P.pixelStorei(P.UNPACK_ROW_LENGTH,g.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,g.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,e.min.x),P.pixelStorei(P.UNPACK_SKIP_ROWS,e.min.y),P.pixelStorei(P.UNPACK_SKIP_IMAGES,e.min.z),n.isDataTexture||n.isData3DTexture?P.texSubImage3D(u,i,t.x,t.y,t.z,a,o,s,c,l,g.data):n.isCompressedArrayTexture?(console.warn(`THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture.`),P.compressedTexSubImage3D(u,i,t.x,t.y,t.z,a,o,s,c,g.data)):P.texSubImage3D(u,i,t.x,t.y,t.z,a,o,s,c,l,g),P.pixelStorei(P.UNPACK_ROW_LENGTH,d),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,f),P.pixelStorei(P.UNPACK_SKIP_PIXELS,p),P.pixelStorei(P.UNPACK_SKIP_ROWS,m),P.pixelStorei(P.UNPACK_SKIP_IMAGES,h),i===0&&r.generateMipmaps&&P.generateMipmap(u),L.unbindTexture()},this.initTexture=function(e){e.isCubeTexture?be.setTextureCube(e,0):e.isData3DTexture?be.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?be.setTexture2DArray(e,0):be.setTexture2D(e,0),L.unbindTexture()},this.resetState=function(){S=0,w=0,T=null,L.reset(),z.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return ge}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=e===`display-p3`?`display-p3`:`srgb`,t.unpackColorSpace=Ye.workingColorSpace===`display-p3-linear`?`display-p3`:`srgb`}get outputEncoding(){return console.warn(`THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead.`),this.outputColorSpace===`srgb`?re:ne}set outputEncoding(e){console.warn(`THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead.`),this.outputColorSpace=e===3001?oe:se}get useLegacyLights(){return console.warn(`THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733.`),this._useLegacyLights}set useLegacyLights(e){console.warn(`THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733.`),this._useLegacyLights=e}},Lo=class extends Io{};Lo.prototype.isWebGL1Renderer=!0;var Ro=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new W(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},zo=class extends dn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}},Bo=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=me,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=L()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn(`THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead.`),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=L()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=L()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Vo=new H,Ho=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Vo.fromBufferAttribute(this,t),Vo.applyMatrix4(e),this.setXYZ(t,Vo.x,Vo.y,Vo.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Vo.fromBufferAttribute(this,t),Vo.applyNormalMatrix(e),this.setXYZ(t,Vo.x,Vo.y,Vo.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Vo.fromBufferAttribute(this,t),Vo.transformDirection(e),this.setXYZ(t,Vo.x,Vo.y,Vo.z);return this}setX(e,t){return this.normalized&&(t=z(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=z(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=z(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=z(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Le(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Le(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Le(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Le(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=z(t,this.array),n=z(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=z(t,this.array),n=z(n,this.array),r=z(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=z(t,this.array),n=z(n,this.array),r=z(r,this.array),i=z(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){console.log(`THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new Pn(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log(`THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Uo=new H,Wo=new at,Go=new at,Ko=new H,qo=new U,Jo=new H,Yo=new jt,Xo=new U,Zo=new zt,Qo=class extends lr{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type=`SkinnedMesh`,this.bindMode=u,this.bindMatrix=new U,this.bindMatrixInverse=new U,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new pt),this.boundingBox.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,Jo),this.boundingBox.expandByPoint(Jo)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new jt),this.boundingSphere.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,Jo),this.boundingSphere.expandByPoint(Jo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Yo.copy(this.boundingSphere),Yo.applyMatrix4(r),e.ray.intersectsSphere(Yo)!==!1&&(Xo.copy(r).invert(),Zo.copy(e.ray).applyMatrix4(Xo),(this.boundingBox===null||Zo.intersectsBox(this.boundingBox)!==!1)&&this._computeIntersections(e,t,Zo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new at,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r===1/0?e.set(1,0,0,0):e.multiplyScalar(r),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===`attached`?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===`detached`?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn(`THREE.SkinnedMesh: Unrecognized bindMode: `+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,r=this.geometry;Wo.fromBufferAttribute(r.attributes.skinIndex,e),Go.fromBufferAttribute(r.attributes.skinWeight,e),Uo.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let e=0;e<4;e++){let r=Go.getComponent(e);if(r!==0){let i=Wo.getComponent(e);qo.multiplyMatrices(n.bones[i].matrixWorld,n.boneInverses[i]),t.addScaledVector(Ko.copy(Uo).applyMatrix4(qo),r)}}return t.applyMatrix4(this.bindMatrixInverse)}boneTransform(e,t){return console.warn(`THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151.`),this.applyBoneTransform(e,t)}},$o=class extends dn{constructor(){super(),this.isBone=!0,this.type=`Bone`}},es=class extends it{constructor(e=null,t=1,n=1,r,i,a,o,s,c=m,l=m,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ts=new U,ns=new U,rs=class e{constructor(e=[],t=[]){this.uuid=L(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn(`THREE.Skeleton: Number of inverse bone matrices does not match amount of bones.`),this.boneInverses=[];for(let e=0,t=this.bones.length;e<t;e++)this.boneInverses.push(new U)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let t=new U;this.bones[e]&&t.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(t)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&t.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&(t.parent&&t.parent.isBone?(t.matrix.copy(t.parent.matrixWorld).invert(),t.matrix.multiply(t.matrixWorld)):t.matrix.copy(t.matrixWorld),t.matrix.decompose(t.position,t.quaternion,t.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let r=0,i=e.length;r<i;r++){let i=e[r]?e[r].matrixWorld:ns;ts.multiplyMatrices(i,t[r]),ts.toArray(n,r*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new e(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new es(t,e,e,T,S);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){let r=e.bones[n],i=t[r];i===void 0&&(console.warn(`THREE.Skeleton: No bone found with UUID:`,r),i=new $o),this.bones.push(i),this.boneInverses.push(new U().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.6,type:`Skeleton`,generator:`Skeleton.toJSON`},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let r=0,i=t.length;r<i;r++){let i=t[r];e.bones.push(i.uuid);let a=n[r];e.boneInverses.push(a.toArray())}return e}},is=class extends Pn{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},as=new U,os=new U,ss=[],cs=new pt,ls=new U,us=new lr,ds=new jt,fs=class extends lr{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new is(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,ls)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new pt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,as),cs.copy(e.boundingBox).applyMatrix4(as),this.boundingBox.union(cs)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new jt),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,as),ds.copy(e.boundingSphere).applyMatrix4(as),this.boundingSphere.union(ds)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){let n=this.matrixWorld,r=this.count;if(us.geometry=this.geometry,us.material=this.material,us.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ds.copy(this.boundingSphere),ds.applyMatrix4(n),e.ray.intersectsSphere(ds)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,as),os.multiplyMatrices(n,as),us.matrixWorld=os,us.raycast(e,ss);for(let e=0,n=ss.length;e<n;e++){let n=ss[e];n.instanceId=i,n.object=this,t.push(n)}ss.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new is(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:`dispose`})}},ps=class extends An{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new W(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ms=new H,hs=new H,gs=new U,_s=new zt,vs=new jt,ys=class extends dn{constructor(e=new Gn,t=new ps){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)ms.fromBufferAttribute(t,e-1),hs.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=ms.distanceTo(hs);e.setAttribute(`lineDistance`,new Ln(n,1))}else console.warn(`THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),vs.copy(n.boundingSphere),vs.applyMatrix4(r),vs.radius+=i,e.ray.intersectsSphere(vs)===!1)return;gs.copy(r).invert(),_s.copy(e.ray).applyMatrix4(gs);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=new H,l=new H,u=new H,d=new H,f=this.isLineSegments?2:1,p=n.index,m=n.attributes.position;if(p!==null){let n=Math.max(0,a.start),r=Math.min(p.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=f){let n=p.getX(i),r=p.getX(i+1);if(c.fromBufferAttribute(m,n),l.fromBufferAttribute(m,r),_s.distanceSqToSegment(c,l,d,u)>s)continue;d.applyMatrix4(this.matrixWorld);let a=e.ray.origin.distanceTo(d);a<e.near||a>e.far||t.push({distance:a,point:u.clone().applyMatrix4(this.matrixWorld),index:i,face:null,faceIndex:null,object:this})}}else{let n=Math.max(0,a.start),r=Math.min(m.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=f){if(c.fromBufferAttribute(m,i),l.fromBufferAttribute(m,i+1),_s.distanceSqToSegment(c,l,d,u)>s)continue;d.applyMatrix4(this.matrixWorld);let n=e.ray.origin.distanceTo(d);n<e.near||n>e.far||t.push({distance:n,point:u.clone().applyMatrix4(this.matrixWorld),index:i,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}},bs=new H,xs=new H,Ss=class extends ys{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)bs.fromBufferAttribute(t,e),xs.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+bs.distanceTo(xs);e.setAttribute(`lineDistance`,new Ln(n,1))}else console.warn(`THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},Cs=class extends ys{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type=`LineLoop`}},ws=class extends An{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new W(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ts=new U,Es=new zt,Ds=new jt,Os=new H,ks=class extends dn{constructor(e=new Gn,t=new ws){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ds.copy(n.boundingSphere),Ds.applyMatrix4(r),Ds.radius+=i,e.ray.intersectsSphere(Ds)===!1)return;Ts.copy(r).invert(),Es.copy(e.ray).applyMatrix4(Ts);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Os.fromBufferAttribute(l,n),As(Os,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Os.fromBufferAttribute(l,a),As(Os,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function As(e,t,n,r,i,a,o){let s=Es.distanceSqToPoint(e);if(s<n){let n=new H;Es.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,object:o})}}var js=class extends it{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ms=class e extends Gn{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Ln(u,3)),this.setAttribute(`normal`,new Ln(d,3)),this.setAttribute(`uv`,new Ln(f,2));function _(){let a=new H,_=new H,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let e=0;e<r;e++)for(let t=0;t<i;t++){let n=m[t][e],r=m[t+1][e],i=m[t+1][e+1],a=m[t][e+1];l.push(n,r,a),l.push(r,i,a),v+=6}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new B,m=new H,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ns=class e extends Ms{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ps=class e extends Gn{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new Ln(i,3)),this.setAttribute(`normal`,new Ln(i.slice(),3)),this.setAttribute(`uv`,new Ln(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new H,r=new H,i=new H;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new H;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new H;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new H,t=new H,n=new H,r=new H,o=new B,s=new B,c=new B;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.details)}},Fs=class e extends Ps{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Is=class e extends Gn{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new H,p=new B;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new Ln(s,3)),this.setAttribute(`normal`,new Ln(c,3)),this.setAttribute(`uv`,new Ln(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Ls=class e extends Gn{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new H,d=new H,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=0;f===0&&a===0?v=.5/t:f===n&&s===Math.PI&&(v=-.5/t);for(let n=0;n<=t;n++){let s=n/t;u.x=-e*Math.cos(r+s*i)*Math.sin(a+_*o),u.y=e*Math.cos(a+_*o),u.z=e*Math.sin(r+s*i)*Math.sin(a+_*o),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(s+v,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Ln(p,3)),this.setAttribute(`normal`,new Ln(m,3)),this.setAttribute(`uv`,new Ln(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Rs=class extends An{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:``},this.type=`MeshStandardMaterial`,this.color=new W(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new W(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},zs=class extends Rs{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new B(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return R(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new W(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new W(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new W(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};function Bs(e,t,n){return!e||!n&&e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Vs(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Hs(e){function t(t,n){return e[t]-e[n]}let n=e.length,r=Array(n);for(let e=0;e!==n;++e)r[e]=e;return r.sort(t),r}function Us(e,t,n){let r=e.length,i=new e.constructor(r);for(let a=0,o=0;o!==r;++a){let r=n[a]*t;for(let n=0;n!==t;++n)i[o++]=e[r+n]}return i}function Ws(e,t,n,r){let i=1,a=e[0];for(;a!==void 0&&a[r]===void 0;)a=e[i++];if(a===void 0)return;let o=a[r];if(o!==void 0){if(Array.isArray(o))do o=a[r],o!==void 0&&(t.push(a.time),n.push.apply(n,o)),a=e[i++];while(a!==void 0);else if(o.toArray!==void 0)do o=a[r],o!==void 0&&(t.push(a.time),o.toArray(n,n.length)),a=e[i++];while(a!==void 0);else do o=a[r],o!==void 0&&(t.push(a.time),n.push(o)),a=e[i++];while(a!==void 0)}}var Gs=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`call to abstract method`)}intervalChanged_(){}},Ks=class extends Gs{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ee,endingEnd:ee}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case M:i=e,o=2*t-n;break;case N:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case M:a=e,s=2*n-t;break;case N:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},qs=class extends Gs{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Js=class extends Gs{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Ys=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Bs(t,this.TimeBufferType),this.values=Bs(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Bs(e.times,Array),values:Bs(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Js(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new qs(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ks(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case k:t=this.InterpolantFactoryMethodDiscrete;break;case A:t=this.InterpolantFactoryMethodLinear;break;case j:t=this.InterpolantFactoryMethodSmooth}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return console.warn(`THREE.KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return k;case this.InterpolantFactoryMethodLinear:return A;case this.InterpolantFactoryMethodSmooth:return j}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error(`THREE.KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(console.error(`THREE.KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){console.error(`THREE.KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){console.error(`THREE.KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Vs(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){console.error(`THREE.KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===j,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};Ys.prototype.TimeBufferType=Float32Array,Ys.prototype.ValueBufferType=Float32Array,Ys.prototype.DefaultInterpolation=A;var Xs=class extends Ys{};Xs.prototype.ValueTypeName=`bool`,Xs.prototype.ValueBufferType=Array,Xs.prototype.DefaultInterpolation=k,Xs.prototype.InterpolantFactoryMethodLinear=void 0,Xs.prototype.InterpolantFactoryMethodSmooth=void 0;var Zs=class extends Ys{};Zs.prototype.ValueTypeName=`color`;var Qs=class extends Ys{};Qs.prototype.ValueTypeName=`number`;var $s=class extends Gs{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)ut.slerpFlat(i,0,a,c-o,a,c,s);return i}},ec=class extends Ys{InterpolantFactoryMethodLinear(e){return new $s(this.times,this.values,this.getValueSize(),e)}};ec.prototype.ValueTypeName=`quaternion`,ec.prototype.DefaultInterpolation=A,ec.prototype.InterpolantFactoryMethodSmooth=void 0;var tc=class extends Ys{};tc.prototype.ValueTypeName=`string`,tc.prototype.ValueBufferType=Array,tc.prototype.DefaultInterpolation=k,tc.prototype.InterpolantFactoryMethodLinear=void 0,tc.prototype.InterpolantFactoryMethodSmooth=void 0;var nc=class extends Ys{};nc.prototype.ValueTypeName=`vector`;var rc=class{constructor(e,t=-1,n,r=te){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=L(),this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,r=1/(e.fps||1);for(let e=0,i=n.length;e!==i;++e)t.push(ac(n[e]).scale(r));let i=new this(e.name,e.duration,t,e.blendMode);return i.uuid=e.uuid,i}static toJSON(e){let t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let e=0,r=n.length;e!==r;++e)t.push(Ys.toJSON(n[e]));return r}static CreateFromMorphTargetSequence(e,t,n,r){let i=t.length,a=[];for(let e=0;e<i;e++){let o=[],s=[];o.push((e+i-1)%i,e,(e+1)%i),s.push(0,1,0);let c=Hs(o);o=Us(o,1,c),s=Us(s,1,c),!r&&o[0]===0&&(o.push(i),s.push(s[0])),a.push(new Qs(`.morphTargetInfluences[`+t[e].name+`]`,o,s).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let t=e;n=t.geometry&&t.geometry.animations||t.animations}for(let e=0;e<n.length;e++)if(n[e].name===t)return n[e];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let r={},i=/^([\w-]*?)([\d]+)$/;for(let t=0,n=e.length;t<n;t++){let n=e[t],a=n.name.match(i);if(a&&a.length>1){let e=a[1],t=r[e];t||(r[e]=t=[]),t.push(n)}}let a=[];for(let e in r)a.push(this.CreateFromMorphTargetSequence(e,r[e],t,n));return a}static parseAnimation(e,t){if(!e)return console.error(`THREE.AnimationClip: No animation in JSONLoader data.`),null;let n=function(e,t,n,r,i){if(n.length!==0){let a=[],o=[];Ws(n,a,o,r),a.length!==0&&i.push(new e(t,a,o))}},r=[],i=e.name||`default`,a=e.fps||30,o=e.blendMode,s=e.length||-1,c=e.hierarchy||[];for(let e=0;e<c.length;e++){let i=c[e].keys;if(i&&i.length!==0){if(i[0].morphTargets){let e={},t=0;for(;t<i.length;t++)if(i[t].morphTargets)for(let n=0;n<i[t].morphTargets.length;n++)e[i[t].morphTargets[n]]=-1;for(let n in e){let e=[],a=[];for(let r=0;r!==i[t].morphTargets.length;++r){let r=i[t];e.push(r.time),a.push(+(r.morphTarget===n))}r.push(new Qs(`.morphTargetInfluence[`+n+`]`,e,a))}s=e.length*a}else{let a=`.bones[`+t[e].name+`]`;n(nc,a+`.position`,i,`pos`,r),n(ec,a+`.quaternion`,i,`rot`,r),n(nc,a+`.scale`,i,`scl`,r)}}}return r.length===0?null:new this(i,s,r,o)}resetDuration(){let e=this.tracks,t=0;for(let n=0,r=e.length;n!==r;++n){let e=this.tracks[n];t=Math.max(t,e.times[e.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e&&=this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}};function ic(e){switch(e.toLowerCase()){case`scalar`:case`double`:case`float`:case`number`:case`integer`:return Qs;case`vector`:case`vector2`:case`vector3`:case`vector4`:return nc;case`color`:return Zs;case`quaternion`:return ec;case`bool`:case`boolean`:return Xs;case`string`:return tc}throw Error(`THREE.KeyframeTrack: Unsupported typeName: `+e)}function ac(e){if(e.type===void 0)throw Error(`THREE.KeyframeTrack: track type undefined, can not parse`);let t=ic(e.type);if(e.times===void 0){let t=[],n=[];Ws(e.keys,t,n,`value`),e.times=t,e.values=n}return t.parse===void 0?new t(e.name,e.times,e.values,e.interpolation):t.parse(e)}var oc={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(this.files[e]=t)},get:function(e){if(this.enabled!==!1)return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}},sc=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null}}},cc=class{constructor(e){this.manager=e===void 0?sc:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};cc.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var lc={},uc=class extends Error{constructor(e,t){super(e),this.response=t}},dc=class extends cc{constructor(e){super(e)}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=oc.get(e);if(i!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(i),this.manager.itemEnd(e)},0),i;if(lc[e]!==void 0){lc[e].push({onLoad:t,onProgress:n,onError:r});return}lc[e]=[],lc[e].push({onLoad:t,onProgress:n,onError:r});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?`include`:`same-origin`}),o=this.mimeType,s=this.responseType;fetch(a).then(t=>{if(t.status===200||t.status===0){if(t.status===0&&console.warn(`THREE.FileLoader: HTTP Status 0 received.`),typeof ReadableStream>`u`||t.body===void 0||t.body.getReader===void 0)return t;let n=lc[e],r=t.body.getReader(),i=t.headers.get(`Content-Length`)||t.headers.get(`X-File-Size`),a=i?parseInt(i):0,o=a!==0,s=0,c=new ReadableStream({start(e){t();function t(){r.read().then(({done:r,value:i})=>{if(r)e.close();else{s+=i.byteLength;let r=new ProgressEvent(`progress`,{lengthComputable:o,loaded:s,total:a});for(let e=0,t=n.length;e<t;e++){let t=n[e];t.onProgress&&t.onProgress(r)}e.enqueue(i),t()}})}}});return new Response(c)}throw new uc(`fetch for "${t.url}" responded with ${t.status}: ${t.statusText}`,t)}).then(e=>{switch(s){case`arraybuffer`:return e.arrayBuffer();case`blob`:return e.blob();case`document`:return e.text().then(e=>new DOMParser().parseFromString(e,o));case`json`:return e.json();default:if(o===void 0)return e.text();{let t=/charset="?([^;"\s]*)"?/i.exec(o),n=t&&t[1]?t[1].toLowerCase():void 0,r=new TextDecoder(n);return e.arrayBuffer().then(e=>r.decode(e))}}}).then(t=>{oc.add(e,t);let n=lc[e];delete lc[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onLoad&&r.onLoad(t)}}).catch(t=>{let n=lc[e];if(n===void 0)throw this.manager.itemError(e),t;delete lc[e];for(let e=0,r=n.length;e<r;e++){let r=n[e];r.onError&&r.onError(t)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}},fc=class extends cc{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=oc.get(e);if(a!==void 0)return i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0),a;let o=Ve(`img`);function s(){l(),oc.add(e,this),t&&t(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),i.manager.itemStart(e),o.src=e,o}},pc=class extends cc{constructor(e){super(e)}load(e,t,n,r){let i=new it,a=new fc(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},mc=class extends dn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new W(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}},hc=class extends mc{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(dn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new W(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},gc=new U,_c=new H,vc=new H,yc=class{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new B(512,512),this.map=null,this.mapPass=null,this.matrix=new U,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Pr,this._frameExtents=new B(1,1),this._viewportCount=1,this._viewports=[new at(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;_c.setFromMatrixPosition(e.matrixWorld),t.position.copy(_c),vc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(vc),t.updateMatrixWorld(),gc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(gc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(gc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},bc=class extends yc{constructor(){super(new Sr(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){let t=this.camera,n=I*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},xc=class extends mc{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(dn.DEFAULT_UP),this.updateMatrix(),this.target=new dn,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new bc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Sc=new U,Cc=new H,wc=new H,Tc=class extends yc{constructor(){super(new Sr(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new B(4,2),this._viewportCount=6,this._viewports=[new at(2,1,1,1),new at(0,1,1,1),new at(3,1,1,1),new at(1,1,1,1),new at(3,0,1,1),new at(1,0,1,1)],this._cubeDirections=[new H(1,0,0),new H(-1,0,0),new H(0,0,1),new H(0,0,-1),new H(0,1,0),new H(0,-1,0)],this._cubeUps=[new H(0,1,0),new H(0,1,0),new H(0,1,0),new H(0,1,0),new H(0,0,1),new H(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,r=this.matrix,i=e.distance||n.far;i!==n.far&&(n.far=i,n.updateProjectionMatrix()),Cc.setFromMatrixPosition(e.matrixWorld),n.position.copy(Cc),wc.copy(n.position),wc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(wc),n.updateMatrixWorld(),r.makeTranslation(-Cc.x,-Cc.y,-Cc.z),Sc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Sc)}},Ec=class extends mc{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new Tc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Dc=class extends yc{constructor(){super(new Kr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Oc=class extends mc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(dn.DEFAULT_UP),this.updateMatrix(),this.target=new dn,this.shadow=new Dc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},kc=class{static decodeText(e){if(typeof TextDecoder<`u`)return new TextDecoder().decode(e);let t=``;for(let n=0,r=e.length;n<r;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){let t=e.lastIndexOf(`/`);return t===-1?`./`:e.slice(0,t+1)}static resolveURL(e,t){return typeof e!=`string`||e===``?``:(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,`$1`)),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Ac=class extends cc{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>`u`&&console.warn(`THREE.ImageBitmapLoader: createImageBitmap() not supported.`),typeof fetch>`u`&&console.warn(`THREE.ImageBitmapLoader: fetch() not supported.`),this.options={premultiplyAlpha:`none`}}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=``),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=oc.get(e);if(a!==void 0){if(i.manager.itemStart(e),a.then){a.then(n=>{t&&t(n),i.manager.itemEnd(e)}).catch(e=>{r&&r(e)});return}return setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0),a}let o={};o.credentials=this.crossOrigin===`anonymous`?`same-origin`:`include`,o.headers=this.requestHeader;let s=fetch(e,o).then(function(e){return e.blob()}).then(function(e){return createImageBitmap(e,Object.assign(i.options,{colorSpaceConversion:`none`}))}).then(function(n){return oc.add(e,n),t&&t(n),i.manager.itemEnd(e),n}).catch(function(t){r&&r(t),oc.remove(e),i.manager.itemError(e),i.manager.itemEnd(e)});oc.add(e,s),i.manager.itemStart(e)}},jc=`\\[\\]\\.:\\/`,Mc=RegExp(`[\\[\\]\\.:\\/]`,`g`),Nc=`[^\\[\\]\\.:\\/]`,Pc=`[^`+jc.replace(`\\.`,``)+`]`,Fc=`((?:WC+[\\/:])*)`.replace(`WC`,Nc),Ic=`(WCOD+)?`.replace(`WCOD`,Pc),Lc=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Nc),Rc=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Nc),zc=RegExp(`^`+Fc+Ic+Lc+Rc+`$`),Bc=[`material`,`materials`,`bones`,`map`],Vc=class{constructor(e,t,n){let r=n||Hc.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Hc=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Mc,``)}static parseTrackName(e){let t=zc.exec(e);if(t===null)throw Error(`PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Bc.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn(`THREE.PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){console.error(`THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){console.error(`THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){console.error(`THREE.PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){console.error(`THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){console.error(`THREE.PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){console.error(`THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;console.error(`THREE.PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.needsUpdate===void 0?t.matrixWorldNeedsUpdate!==void 0&&(s=this.Versioning.MatrixWorldNeedsUpdate):s=this.Versioning.NeedsUpdate;let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){console.error(`THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Hc.Composite=Vc,Hc.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Hc.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Hc.prototype.GetterByBindingType=[Hc.prototype._getValue_direct,Hc.prototype._getValue_array,Hc.prototype._getValue_arrayElement,Hc.prototype._getValue_toArray],Hc.prototype.SetterByBindingTypeAndVersioning=[[Hc.prototype._setValue_direct,Hc.prototype._setValue_direct_setNeedsUpdate,Hc.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Hc.prototype._setValue_array,Hc.prototype._setValue_array_setNeedsUpdate,Hc.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Hc.prototype._setValue_arrayElement,Hc.prototype._setValue_arrayElement_setNeedsUpdate,Hc.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Hc.prototype._setValue_fromArray,Hc.prototype._setValue_fromArray_setNeedsUpdate,Hc.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Uc=class{constructor(e,t,n=0,r=1/0){this.ray=new zt(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Xt,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error(`THREE.Raycaster: Unsupported camera type: `+t.type)}intersectObject(e,t=!0,n=[]){return Gc(e,this,n,t),n.sort(Wc),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)Gc(e[r],this,n,t);return n.sort(Wc),n}};function Wc(e,t){return e.distance-t.distance}function Gc(e,t,n,r){if(e.layers.test(t.layers)&&e.raycast(t,n),r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)Gc(r[e],t,n,!0)}}var Kc=class{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){let e=1e-6;return this.phi=Math.max(e,Math.min(Math.PI-e,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(R(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`160`}})),typeof window<`u`&&(window.__THREE__?console.warn(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`160`);var qc={type:`change`},Jc={type:`start`},Yc={type:`end`},Xc=new zt,Zc=new jr,Qc=Math.cos(70*Re.DEG2RAD),$c=class extends _e{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction=`none`,this.enabled=!0,this.target=new H,this.cursor=new H,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:`ArrowLeft`,UP:`ArrowUp`,RIGHT:`ArrowRight`,BOTTOM:`ArrowDown`},this.mouseButtons={LEFT:c.ROTATE,MIDDLE:c.DOLLY,RIGHT:c.PAN},this.touches={ONE:l.ROTATE,TWO:l.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(e){e.addEventListener(`keydown`,Se),this._domElementKeyEvents=e},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener(`keydown`,Se),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(qc),n.update(),i=r.NONE},this.update=function(){let t=new H,c=new ut().setFromUnitVectors(e.up,new H(0,1,0)),l=c.clone().invert(),f=new H,p=new ut,m=new H,h=2*Math.PI;return function(g=null){let _=n.object.position;t.copy(_).sub(n.target),t.applyQuaternion(c),o.setFromVector3(t),n.autoRotate&&i===r.NONE&&O(E(g)),n.enableDamping?(o.theta+=s.theta*n.dampingFactor,o.phi+=s.phi*n.dampingFactor):(o.theta+=s.theta,o.phi+=s.phi);let v=n.minAzimuthAngle,y=n.maxAzimuthAngle;isFinite(v)&&isFinite(y)&&(v<-Math.PI?v+=h:v>Math.PI&&(v-=h),y<-Math.PI?y+=h:y>Math.PI&&(y-=h),v<=y?o.theta=Math.max(v,Math.min(y,o.theta)):o.theta=o.theta>(v+y)/2?Math.max(v,o.theta):Math.min(y,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(d,n.dampingFactor):n.target.add(d),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&C||n.object.isOrthographicCamera?o.radius=ne(o.radius):o.radius=ne(o.radius*u),t.setFromSpherical(o),t.applyQuaternion(l),_.copy(n.target).add(t),n.object.lookAt(n.target),n.enableDamping===!0?(s.theta*=1-n.dampingFactor,s.phi*=1-n.dampingFactor,d.multiplyScalar(1-n.dampingFactor)):(s.set(0,0,0),d.set(0,0,0));let b=!1;if(n.zoomToCursor&&C){let r=null;if(n.object.isPerspectiveCamera){let e=t.length();r=ne(e*u);let i=e-r;n.object.position.addScaledVector(x,i),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let e=new H(S.x,S.y,0);e.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/u)),n.object.updateProjectionMatrix(),b=!0;let i=new H(S.x,S.y,0);i.unproject(n.object),n.object.position.sub(i).add(e),n.object.updateMatrixWorld(),r=t.length()}else console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.`),n.zoomToCursor=!1;r!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(r).add(n.object.position):(Xc.origin.copy(n.object.position),Xc.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Xc.direction))<Qc?e.lookAt(n.target):(Zc.setFromNormalAndCoplanarPoint(n.object.up,n.target),Xc.intersectPlane(Zc,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/u)),n.object.updateProjectionMatrix(),b=!0);return u=1,C=!1,b||f.distanceToSquared(n.object.position)>a||8*(1-p.dot(n.object.quaternion))>a||m.distanceToSquared(n.target)>0?(n.dispatchEvent(qc),f.copy(n.object.position),p.copy(n.object.quaternion),m.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener(`contextmenu`,Te),n.domElement.removeEventListener(`pointerdown`,I),n.domElement.removeEventListener(`pointercancel`,R),n.domElement.removeEventListener(`wheel`,xe),n.domElement.removeEventListener(`pointermove`,L),n.domElement.removeEventListener(`pointerup`,R),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener(`keydown`,Se),n._domElementKeyEvents=null)};let n=this,r={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},i=r.NONE,a=1e-6,o=new Kc,s=new Kc,u=1,d=new H,f=new B,p=new B,m=new B,h=new B,g=new B,_=new B,v=new B,y=new B,b=new B,x=new H,S=new B,C=!1,w=[],T={};function E(e){return e===null?2*Math.PI/60/60*n.autoRotateSpeed:2*Math.PI/60*n.autoRotateSpeed*e}function D(e){let t=Math.abs(e)/(100*(window.devicePixelRatio|0));return .95**(n.zoomSpeed*t)}function O(e){s.theta-=e}function k(e){s.phi-=e}let A=function(){let e=new H;return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),d.add(e)}}(),j=function(){let e=new H;return function(t,r){n.screenSpacePanning===!0?e.setFromMatrixColumn(r,1):(e.setFromMatrixColumn(r,0),e.crossVectors(n.object.up,e)),e.multiplyScalar(t),d.add(e)}}(),ee=function(){let e=new H;return function(t,r){let i=n.domElement;if(n.object.isPerspectiveCamera){let a=n.object.position;e.copy(a).sub(n.target);let o=e.length();o*=Math.tan(n.object.fov/2*Math.PI/180),A(2*t*o/i.clientHeight,n.object.matrix),j(2*r*o/i.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(A(t*(n.object.right-n.object.left)/n.object.zoom/i.clientWidth,n.object.matrix),j(r*(n.object.top-n.object.bottom)/n.object.zoom/i.clientHeight,n.object.matrix)):(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.`),n.enablePan=!1)}}();function M(e){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?u/=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),n.enableZoom=!1)}function N(e){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?u*=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),n.enableZoom=!1)}function te(e,t){if(!n.zoomToCursor)return;C=!0;let r=n.domElement.getBoundingClientRect(),i=e-r.left,a=t-r.top,o=r.width,s=r.height;S.x=i/o*2-1,S.y=-(a/s)*2+1,x.set(S.x,S.y,1).unproject(n.object).sub(n.object.position).normalize()}function ne(e){return Math.max(n.minDistance,Math.min(n.maxDistance,e))}function re(e){f.set(e.clientX,e.clientY)}function ie(e){te(e.clientX,e.clientX),v.set(e.clientX,e.clientY)}function ae(e){h.set(e.clientX,e.clientY)}function oe(e){p.set(e.clientX,e.clientY),m.subVectors(p,f).multiplyScalar(n.rotateSpeed);let t=n.domElement;O(2*Math.PI*m.x/t.clientHeight),k(2*Math.PI*m.y/t.clientHeight),f.copy(p),n.update()}function se(e){y.set(e.clientX,e.clientY),b.subVectors(y,v),b.y>0?M(D(b.y)):b.y<0&&N(D(b.y)),v.copy(y),n.update()}function ce(e){g.set(e.clientX,e.clientY),_.subVectors(g,h).multiplyScalar(n.panSpeed),ee(_.x,_.y),h.copy(g),n.update()}function le(e){te(e.clientX,e.clientY),e.deltaY<0?N(D(e.deltaY)):e.deltaY>0&&M(D(e.deltaY)),n.update()}function ue(e){let t=!1;switch(e.code){case n.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?k(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ee(0,n.keyPanSpeed),t=!0;break;case n.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?k(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ee(0,-n.keyPanSpeed),t=!0;break;case n.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?O(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ee(n.keyPanSpeed,0),t=!0;break;case n.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?O(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ee(-n.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),n.update())}function de(e){if(w.length===1)f.set(e.pageX,e.pageY);else{let t=ke(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);f.set(n,r)}}function fe(e){if(w.length===1)h.set(e.pageX,e.pageY);else{let t=ke(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);h.set(n,r)}}function pe(e){let t=ke(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);v.set(0,i)}function me(e){n.enableZoom&&pe(e),n.enablePan&&fe(e)}function he(e){n.enableZoom&&pe(e),n.enableRotate&&de(e)}function ge(e){if(w.length==1)p.set(e.pageX,e.pageY);else{let t=ke(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);p.set(n,r)}m.subVectors(p,f).multiplyScalar(n.rotateSpeed);let t=n.domElement;O(2*Math.PI*m.x/t.clientHeight),k(2*Math.PI*m.y/t.clientHeight),f.copy(p)}function _e(e){if(w.length===1)g.set(e.pageX,e.pageY);else{let t=ke(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);g.set(n,r)}_.subVectors(g,h).multiplyScalar(n.panSpeed),ee(_.x,_.y),h.copy(g)}function P(e){let t=ke(e),r=e.pageX-t.x,i=e.pageY-t.y,a=Math.sqrt(r*r+i*i);y.set(0,a),b.set(0,(y.y/v.y)**+n.zoomSpeed),M(b.y),v.copy(y),te((e.pageX+t.x)*.5,(e.pageY+t.y)*.5)}function ve(e){n.enableZoom&&P(e),n.enablePan&&_e(e)}function F(e){n.enableZoom&&P(e),n.enableRotate&&ge(e)}function I(e){n.enabled!==!1&&(w.length===0&&(n.domElement.setPointerCapture(e.pointerId),n.domElement.addEventListener(`pointermove`,L),n.domElement.addEventListener(`pointerup`,R)),Ee(e),e.pointerType===`touch`?Ce(e):ye(e))}function L(e){n.enabled!==!1&&(e.pointerType===`touch`?we(e):be(e))}function R(e){De(e),w.length===0&&(n.domElement.releasePointerCapture(e.pointerId),n.domElement.removeEventListener(`pointermove`,L),n.domElement.removeEventListener(`pointerup`,R)),n.dispatchEvent(Yc),i=r.NONE}function ye(e){let t;switch(e.button){case 0:t=n.mouseButtons.LEFT;break;case 1:t=n.mouseButtons.MIDDLE;break;case 2:t=n.mouseButtons.RIGHT;break;default:t=-1}switch(t){case c.DOLLY:if(n.enableZoom===!1)return;ie(e),i=r.DOLLY;break;case c.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(n.enablePan===!1)return;ae(e),i=r.PAN}else{if(n.enableRotate===!1)return;re(e),i=r.ROTATE}break;case c.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(n.enableRotate===!1)return;re(e),i=r.ROTATE}else{if(n.enablePan===!1)return;ae(e),i=r.PAN}break;default:i=r.NONE}i!==r.NONE&&n.dispatchEvent(Jc)}function be(e){switch(i){case r.ROTATE:if(n.enableRotate===!1)return;oe(e);break;case r.DOLLY:if(n.enableZoom===!1)return;se(e);break;case r.PAN:if(n.enablePan===!1)return;ce(e)}}function xe(e){n.enabled!==!1&&n.enableZoom!==!1&&i===r.NONE&&(e.preventDefault(),n.dispatchEvent(Jc),le(e),n.dispatchEvent(Yc))}function Se(e){n.enabled!==!1&&n.enablePan!==!1&&ue(e)}function Ce(e){switch(Oe(e),w.length){case 1:switch(n.touches.ONE){case l.ROTATE:if(n.enableRotate===!1)return;de(e),i=r.TOUCH_ROTATE;break;case l.PAN:if(n.enablePan===!1)return;fe(e),i=r.TOUCH_PAN;break;default:i=r.NONE}break;case 2:switch(n.touches.TWO){case l.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;me(e),i=r.TOUCH_DOLLY_PAN;break;case l.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;he(e),i=r.TOUCH_DOLLY_ROTATE;break;default:i=r.NONE}break;default:i=r.NONE}i!==r.NONE&&n.dispatchEvent(Jc)}function we(e){switch(Oe(e),i){case r.TOUCH_ROTATE:if(n.enableRotate===!1)return;ge(e),n.update();break;case r.TOUCH_PAN:if(n.enablePan===!1)return;_e(e),n.update();break;case r.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;ve(e),n.update();break;case r.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;F(e),n.update();break;default:i=r.NONE}}function Te(e){n.enabled!==!1&&e.preventDefault()}function Ee(e){w.push(e.pointerId)}function De(e){delete T[e.pointerId];for(let t=0;t<w.length;t++)if(w[t]==e.pointerId){w.splice(t,1);return}}function Oe(e){let t=T[e.pointerId];t===void 0&&(t=new B,T[e.pointerId]=t),t.set(e.pageX,e.pageY)}function ke(e){let t=e.pointerId===w[0]?w[1]:w[0];return T[t]}n.domElement.addEventListener(`contextmenu`,Te),n.domElement.addEventListener(`pointerdown`,I),n.domElement.addEventListener(`pointercancel`,R),n.domElement.addEventListener(`wheel`,xe,{passive:!1}),this.update()}};function el(e,t){if(t===0)return console.warn(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.`),e;if(t===2||t===1){let n=e.getIndex();if(n===null){let t=[],r=e.getAttribute(`position`);if(r!==void 0){for(let e=0;e<r.count;e++)t.push(e);e.setIndex(t),n=e.getIndex()}else return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.`),e}let r=n.count-2,i=[];if(t===2)for(let e=1;e<=r;e++)i.push(n.getX(0)),i.push(n.getX(e)),i.push(n.getX(e+1));else for(let e=0;e<r;e++)e%2==0?(i.push(n.getX(e)),i.push(n.getX(e+1)),i.push(n.getX(e+2))):(i.push(n.getX(e+2)),i.push(n.getX(e+1)),i.push(n.getX(e)));i.length/3!==r&&console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.`);let a=e.clone();return a.setIndex(i),a.clearGroups(),a}return console.error(`THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:`,t),e}var tl=class extends cc{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new ol(e)}),this.register(function(e){return new hl(e)}),this.register(function(e){return new gl(e)}),this.register(function(e){return new _l(e)}),this.register(function(e){return new cl(e)}),this.register(function(e){return new ll(e)}),this.register(function(e){return new ul(e)}),this.register(function(e){return new dl(e)}),this.register(function(e){return new al(e)}),this.register(function(e){return new fl(e)}),this.register(function(e){return new sl(e)}),this.register(function(e){return new ml(e)}),this.register(function(e){return new pl(e)}),this.register(function(e){return new rl(e)}),this.register(function(e){return new vl(e)}),this.register(function(e){return new yl(e)})}load(e,t,n,r){let i=this,a;if(this.resourcePath!==``)a=this.resourcePath;else if(this.path!==``){let t=kc.extractUrlBase(e);a=kc.resolveURL(t,this.path)}else a=kc.extractUrlBase(e);this.manager.itemStart(e);let o=function(t){r?r(t):console.error(t),i.manager.itemError(e),i.manager.itemEnd(e)},s=new dc(this.manager);s.setPath(this.path),s.setResponseType(`arraybuffer`),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(n){try{i.parse(n,a,function(n){t(n),i.manager.itemEnd(e)},o)}catch(e){o(e)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setDDSLoader(){throw Error(`THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".`)}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let i,a={},o={},s=new TextDecoder;if(typeof e==`string`)i=JSON.parse(e);else if(e instanceof ArrayBuffer){if(s.decode(new Uint8Array(e,0,4))===bl){try{a[q.KHR_BINARY_GLTF]=new Cl(e)}catch(e){r&&r(e);return}i=JSON.parse(a[q.KHR_BINARY_GLTF].content)}else i=JSON.parse(s.decode(e))}else i=e;if(i.asset===void 0||i.asset.version[0]<2){r&&r(Error(`THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.`));return}let c=new Yl(i,{path:t||this.resourcePath||``,crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let e=0;e<this.pluginCallbacks.length;e++){let t=this.pluginCallbacks[e](c);t.name||console.error(`THREE.GLTFLoader: Invalid plugin found: missing name`),o[t.name]=t,a[t.name]=!0}if(i.extensionsUsed)for(let e=0;e<i.extensionsUsed.length;++e){let t=i.extensionsUsed[e],n=i.extensionsRequired||[];switch(t){case q.KHR_MATERIALS_UNLIT:a[t]=new il;break;case q.KHR_DRACO_MESH_COMPRESSION:a[t]=new wl(i,this.dracoLoader);break;case q.KHR_TEXTURE_TRANSFORM:a[t]=new Tl;break;case q.KHR_MESH_QUANTIZATION:a[t]=new El;break;default:n.indexOf(t)>=0&&o[t]===void 0&&console.warn(`THREE.GLTFLoader: Unknown extension "`+t+`".`)}}c.setExtensions(a),c.setPlugins(o),c.parse(n,r)}parseAsync(e,t){let n=this;return new Promise(function(r,i){n.parse(e,t,r,i)})}};function nl(){let e={};return{get:function(t){return e[t]},add:function(t,n){e[t]=n},remove:function(t){delete e[t]},removeAll:function(){e={}}}}var q={KHR_BINARY_GLTF:`KHR_binary_glTF`,KHR_DRACO_MESH_COMPRESSION:`KHR_draco_mesh_compression`,KHR_LIGHTS_PUNCTUAL:`KHR_lights_punctual`,KHR_MATERIALS_CLEARCOAT:`KHR_materials_clearcoat`,KHR_MATERIALS_IOR:`KHR_materials_ior`,KHR_MATERIALS_SHEEN:`KHR_materials_sheen`,KHR_MATERIALS_SPECULAR:`KHR_materials_specular`,KHR_MATERIALS_TRANSMISSION:`KHR_materials_transmission`,KHR_MATERIALS_IRIDESCENCE:`KHR_materials_iridescence`,KHR_MATERIALS_ANISOTROPY:`KHR_materials_anisotropy`,KHR_MATERIALS_UNLIT:`KHR_materials_unlit`,KHR_MATERIALS_VOLUME:`KHR_materials_volume`,KHR_TEXTURE_BASISU:`KHR_texture_basisu`,KHR_TEXTURE_TRANSFORM:`KHR_texture_transform`,KHR_MESH_QUANTIZATION:`KHR_mesh_quantization`,KHR_MATERIALS_EMISSIVE_STRENGTH:`KHR_materials_emissive_strength`,EXT_MATERIALS_BUMP:`EXT_materials_bump`,EXT_TEXTURE_WEBP:`EXT_texture_webp`,EXT_TEXTURE_AVIF:`EXT_texture_avif`,EXT_MESHOPT_COMPRESSION:`EXT_meshopt_compression`,EXT_MESH_GPU_INSTANCING:`EXT_mesh_gpu_instancing`},rl=class{constructor(e){this.parser=e,this.name=q.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n=`light:`+e,r=t.cache.get(n);if(r)return r;let i=t.json,a=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e],o,s=new W(16777215);a.color!==void 0&&s.setRGB(a.color[0],a.color[1],a.color[2],se);let c=a.range===void 0?0:a.range;switch(a.type){case`directional`:o=new Oc(s),o.target.position.set(0,0,-1),o.add(o.target);break;case`point`:o=new Ec(s),o.distance=c;break;case`spot`:o=new xc(s),o.distance=c,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle===void 0?0:a.spot.innerConeAngle,a.spot.outerConeAngle=a.spot.outerConeAngle===void 0?Math.PI/4:a.spot.outerConeAngle,o.angle=a.spot.outerConeAngle,o.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,o.target.position.set(0,0,-1),o.add(o.target);break;default:throw Error(`THREE.GLTFLoader: Unexpected light type: `+a.type)}return o.position.set(0,0,0),o.decay=2,Vl(o,a),a.intensity!==void 0&&(o.intensity=a.intensity),o.name=t.createUniqueName(a.name||`light_`+e),r=Promise.resolve(o),t.cache.add(n,r),r}getDependency(e,t){if(e===`light`)return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],i=(r.extensions&&r.extensions[this.name]||{}).light;return i===void 0?null:this._loadLight(i).then(function(e){return n._getNodeRef(t.cache,i,e)})}},il=class{constructor(){this.name=q.KHR_MATERIALS_UNLIT}getMaterialType(){return jn}extendParams(e,t,n){let r=[];e.color=new W(1,1,1),e.opacity=1;let i=t.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){let t=i.baseColorFactor;e.color.setRGB(t[0],t[1],t[2],se),e.opacity=t[3]}i.baseColorTexture!==void 0&&r.push(n.assignTexture(e,`map`,i.baseColorTexture,oe))}return Promise.all(r)}},al=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let r=n.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}},ol=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:zs}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&i.push(n.assignTexture(t,`clearcoatMap`,a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&i.push(n.assignTexture(t,`clearcoatRoughnessMap`,a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(i.push(n.assignTexture(t,`clearcoatNormalMap`,a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){let e=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new B(e,e)}return Promise.all(i)}},sl=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:zs}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&i.push(n.assignTexture(t,`iridescenceMap`,a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&i.push(n.assignTexture(t,`iridescenceThicknessMap`,a.iridescenceThicknessTexture)),Promise.all(i)}},cl=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_SHEEN}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:zs}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[];t.sheenColor=new W(0,0,0),t.sheenRoughness=0,t.sheen=1;let a=r.extensions[this.name];if(a.sheenColorFactor!==void 0){let e=a.sheenColorFactor;t.sheenColor.setRGB(e[0],e[1],e[2],se)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&i.push(n.assignTexture(t,`sheenColorMap`,a.sheenColorTexture,oe)),a.sheenRoughnessTexture!==void 0&&i.push(n.assignTexture(t,`sheenRoughnessMap`,a.sheenRoughnessTexture)),Promise.all(i)}},ll=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:zs}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&i.push(n.assignTexture(t,`transmissionMap`,a.transmissionTexture)),Promise.all(i)}},ul=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_VOLUME}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:zs}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];t.thickness=a.thicknessFactor===void 0?0:a.thicknessFactor,a.thicknessTexture!==void 0&&i.push(n.assignTexture(t,`thicknessMap`,a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;let o=a.attenuationColor||[1,1,1];return t.attenuationColor=new W().setRGB(o[0],o[1],o[2],se),Promise.all(i)}},dl=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_IOR}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:zs}extendMaterialParams(e,t){let n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();let r=n.extensions[this.name];return t.ior=r.ior===void 0?1.5:r.ior,Promise.resolve()}},fl=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_SPECULAR}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:zs}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];t.specularIntensity=a.specularFactor===void 0?1:a.specularFactor,a.specularTexture!==void 0&&i.push(n.assignTexture(t,`specularIntensityMap`,a.specularTexture));let o=a.specularColorFactor||[1,1,1];return t.specularColor=new W().setRGB(o[0],o[1],o[2],se),a.specularColorTexture!==void 0&&i.push(n.assignTexture(t,`specularColorMap`,a.specularColorTexture,oe)),Promise.all(i)}},pl=class{constructor(e){this.parser=e,this.name=q.EXT_MATERIALS_BUMP}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:zs}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return t.bumpScale=a.bumpFactor===void 0?1:a.bumpFactor,a.bumpTexture!==void 0&&i.push(n.assignTexture(t,`bumpMap`,a.bumpTexture)),Promise.all(i)}},ml=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let t=this.parser.json.materials[e];return!t.extensions||!t.extensions[this.name]?null:zs}extendMaterialParams(e,t){let n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();let i=[],a=r.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&i.push(n.assignTexture(t,`anisotropyMap`,a.anisotropyTexture)),Promise.all(i)}},hl=class{constructor(e){this.parser=e,this.name=q.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let i=r.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures`);return null}return t.loadTextureImage(e,i.source,a)}},gl=class{constructor(e){this.parser=e,this.name=q.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return this.detectSupport().then(function(i){if(i)return n.loadTextureImage(e,a.source,s);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw Error(`THREE.GLTFLoader: WebP required by asset but unsupported.`);return n.loadTexture(e)})}detectSupport(){return this.isSupported||=new Promise(function(e){let t=new Image;t.src=`data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA`,t.onload=t.onerror=function(){e(t.height===1)}}),this.isSupported}},_l=class{constructor(e){this.parser=e,this.name=q.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){let t=this.name,n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[t])return null;let a=i.extensions[t],o=r.images[a.source],s=n.textureLoader;if(o.uri){let e=n.options.manager.getHandler(o.uri);e!==null&&(s=e)}return this.detectSupport().then(function(i){if(i)return n.loadTextureImage(e,a.source,s);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw Error(`THREE.GLTFLoader: AVIF required by asset but unsupported.`);return n.loadTexture(e)})}detectSupport(){return this.isSupported||=new Promise(function(e){let t=new Image;t.src=`data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=`,t.onload=t.onerror=function(){e(t.height===1)}}),this.isSupported}},vl=class{constructor(e){this.name=q.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let e=n.extensions[this.name],r=this.parser.getDependency(`buffer`,e.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw Error(`THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files`);return null}return r.then(function(t){let n=e.byteOffset||0,r=e.byteLength||0,a=e.count,o=e.byteStride,s=new Uint8Array(t,n,r);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(a,o,s,e.mode,e.filter).then(function(e){return e.buffer}):i.ready.then(function(){let t=new ArrayBuffer(a*o);return i.decodeGltfBuffer(new Uint8Array(t),a,o,s,e.mode,e.filter),t})})}return null}},yl=class{constructor(e){this.name=q.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let r=t.meshes[n.mesh];for(let e of r.primitives)if(e.mode!==Al.TRIANGLES&&e.mode!==Al.TRIANGLE_STRIP&&e.mode!==Al.TRIANGLE_FAN&&e.mode!==void 0)return null;let i=n.extensions[this.name].attributes,a=[],o={};for(let e in i)a.push(this.parser.getDependency(`accessor`,i[e]).then(t=>(o[e]=t,o[e])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(e=>{let t=e.pop(),n=t.isGroup?t.children:[t],r=e[0].count,i=[];for(let e of n){let t=new U,n=new H,a=new ut,s=new H(1,1,1),c=new fs(e.geometry,e.material,r);for(let e=0;e<r;e++)o.TRANSLATION&&n.fromBufferAttribute(o.TRANSLATION,e),o.ROTATION&&a.fromBufferAttribute(o.ROTATION,e),o.SCALE&&s.fromBufferAttribute(o.SCALE,e),c.setMatrixAt(e,t.compose(n,a,s));for(let t in o)if(t===`_COLOR_0`){let e=o[t];c.instanceColor=new is(e.array,e.itemSize,e.normalized)}else t!==`TRANSLATION`&&t!==`ROTATION`&&t!==`SCALE`&&e.geometry.setAttribute(t,o[t]);dn.prototype.copy.call(c,e),this.parser.assignFinalMaterial(c),i.push(c)}return t.isGroup?(t.clear(),t.add(...i),t):i[0]}))}},bl=`glTF`,xl=12,Sl={JSON:1313821514,BIN:5130562},Cl=class{constructor(e){this.name=q.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,xl),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==bl)throw Error(`THREE.GLTFLoader: Unsupported glTF-Binary header.`);if(this.header.version<2)throw Error(`THREE.GLTFLoader: Legacy binary file detected.`);let r=this.header.length-xl,i=new DataView(e,xl),a=0;for(;a<r;){let t=i.getUint32(a,!0);a+=4;let r=i.getUint32(a,!0);if(a+=4,r===Sl.JSON){let r=new Uint8Array(e,xl+a,t);this.content=n.decode(r)}else if(r===Sl.BIN){let n=xl+a;this.body=e.slice(n,n+t)}a+=t}if(this.content===null)throw Error(`THREE.GLTFLoader: JSON content not found.`)}},wl=class{constructor(e,t){if(!t)throw Error(`THREE.GLTFLoader: No DRACOLoader instance provided.`);this.name=q.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,r=this.dracoLoader,i=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},s={},c={};for(let e in a){let t=Fl[e]||e.toLowerCase();o[t]=a[e]}for(let t in e.attributes){let r=Fl[t]||t.toLowerCase();if(a[t]!==void 0){let i=n.accessors[e.attributes[t]];c[r]=jl[i.componentType].name,s[r]=i.normalized===!0}}return t.getDependency(`bufferView`,i).then(function(e){return new Promise(function(t,n){r.decodeDracoFile(e,function(e){for(let t in e.attributes){let n=e.attributes[t],r=s[t];r!==void 0&&(n.normalized=r)}t(e)},o,c,se,n)})})}},Tl=class{constructor(){this.name=q.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},El=class{constructor(){this.name=q.KHR_MESH_QUANTIZATION}},Dl=class extends Gs{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r*3+r;for(let e=0;e!==r;e++)t[e]=n[i+e];return t}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=o*2,c=o*3,l=r-t,u=(n-t)/l,d=u*u,f=d*u,p=e*c,m=p-c,h=-2*f+3*d,g=f-d,_=1-h,v=g-d+u;for(let e=0;e!==o;e++){let t=a[m+e+o],n=a[m+e+s]*l,r=a[p+e+o],c=a[p+e]*l;i[e]=_*t+v*n+h*r+g*c}return i}},Ol=new ut,kl=class extends Dl{interpolate_(e,t,n,r){let i=super.interpolate_(e,t,n,r);return Ol.fromArray(i).normalize().toArray(i),i}},Al={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},jl={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Ml={9728:m,9729:_,9984:h,9985:v,9986:g,9987:y},Nl={33071:f,33648:p,10497:d},Pl={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Fl={POSITION:`position`,NORMAL:`normal`,TANGENT:`tangent`,TEXCOORD_0:`uv`,TEXCOORD_1:`uv1`,TEXCOORD_2:`uv2`,TEXCOORD_3:`uv3`,COLOR_0:`color`,WEIGHTS_0:`skinWeight`,JOINTS_0:`skinIndex`},Il={scale:`scale`,translation:`position`,rotation:`quaternion`,weights:`morphTargetInfluences`},Ll={CUBICSPLINE:void 0,LINEAR:A,STEP:k},Rl={OPAQUE:`OPAQUE`,MASK:`MASK`,BLEND:`BLEND`};function zl(e){return e.DefaultMaterial===void 0&&(e.DefaultMaterial=new Rs({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:0})),e.DefaultMaterial}function Bl(e,t,n){for(let r in n.extensions)e[r]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[r]=n.extensions[r])}function Vl(e,t){t.extras!==void 0&&(typeof t.extras==`object`?Object.assign(e.userData,t.extras):console.warn(`THREE.GLTFLoader: Ignoring primitive type .extras, `+t.extras))}function Hl(e,t,n){let r=!1,i=!1,a=!1;for(let e=0,n=t.length;e<n;e++){let n=t[e];if(n.POSITION!==void 0&&(r=!0),n.NORMAL!==void 0&&(i=!0),n.COLOR_0!==void 0&&(a=!0),r&&i&&a)break}if(!r&&!i&&!a)return Promise.resolve(e);let o=[],s=[],c=[];for(let l=0,u=t.length;l<u;l++){let u=t[l];if(r){let t=u.POSITION===void 0?e.attributes.position:n.getDependency(`accessor`,u.POSITION);o.push(t)}if(i){let t=u.NORMAL===void 0?e.attributes.normal:n.getDependency(`accessor`,u.NORMAL);s.push(t)}if(a){let t=u.COLOR_0===void 0?e.attributes.color:n.getDependency(`accessor`,u.COLOR_0);c.push(t)}}return Promise.all([Promise.all(o),Promise.all(s),Promise.all(c)]).then(function(t){let n=t[0],o=t[1],s=t[2];return r&&(e.morphAttributes.position=n),i&&(e.morphAttributes.normal=o),a&&(e.morphAttributes.color=s),e.morphTargetsRelative=!0,e})}function Ul(e,t){if(e.updateMorphTargets(),t.weights!==void 0)for(let n=0,r=t.weights.length;n<r;n++)e.morphTargetInfluences[n]=t.weights[n];if(t.extras&&Array.isArray(t.extras.targetNames)){let n=t.extras.targetNames;if(e.morphTargetInfluences.length===n.length){e.morphTargetDictionary={};for(let t=0,r=n.length;t<r;t++)e.morphTargetDictionary[n[t]]=t}else console.warn(`THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.`)}}function Wl(e){let t,n=e.extensions&&e.extensions[q.KHR_DRACO_MESH_COMPRESSION];if(t=n?`draco:`+n.bufferView+`:`+n.indices+`:`+Gl(n.attributes):e.indices+`:`+Gl(e.attributes)+`:`+e.mode,e.targets!==void 0)for(let n=0,r=e.targets.length;n<r;n++)t+=`:`+Gl(e.targets[n]);return t}function Gl(e){let t=``,n=Object.keys(e).sort();for(let r=0,i=n.length;r<i;r++)t+=n[r]+`:`+e[n[r]]+`;`;return t}function Kl(e){switch(e){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw Error(`THREE.GLTFLoader: Unsupported normalized accessor component type.`)}}function ql(e){return e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0?`image/jpeg`:e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0?`image/webp`:`image/png`}var Jl=new U,Yl=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new nl,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=!1,i=-1;typeof navigator<`u`&&(n=/^((?!chrome|android).)*safari/i.test(navigator.userAgent)===!0,r=navigator.userAgent.indexOf(`Firefox`)>-1,i=r?navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]:-1),this.textureLoader=typeof createImageBitmap>`u`||n||r&&i<98?new pc(this.options.manager):new Ac(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new dc(this.options.manager),this.fileLoader.setResponseType(`arraybuffer`),this.options.crossOrigin===`use-credentials`&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,r=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(e){return e._markDefs&&e._markDefs()}),Promise.all(this._invokeAll(function(e){return e.beforeRoot&&e.beforeRoot()})).then(function(){return Promise.all([n.getDependencies(`scene`),n.getDependencies(`animation`),n.getDependencies(`camera`)])}).then(function(t){let a={scene:t[0][r.scene||0],scenes:t[0],animations:t[1],cameras:t[2],asset:r.asset,parser:n,userData:{}};return Bl(i,a,r),Vl(a,r),Promise.all(n._invokeAll(function(e){return e.afterRoot&&e.afterRoot(a)})).then(function(){e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let n=0,r=t.length;n<r;n++){let r=t[n].joints;for(let t=0,n=r.length;t<n;t++)e[r[t]].isBone=!0}for(let t=0,r=e.length;t<r;t++){let r=e[t];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let r=n.clone(),i=(e,t)=>{let n=this.associations.get(e);n!=null&&this.associations.set(t,n);for(let[n,r]of e.children.entries())i(r,t.children[n])};return i(n,r),r.name+=`_instance_`+e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let r=e(t[n]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let r=0;r<t.length;r++){let i=e(t[r]);i&&n.push(i)}return n}getDependency(e,t){let n=e+`:`+t,r=this.cache.get(n);if(!r){switch(e){case`scene`:r=this.loadScene(t);break;case`node`:r=this._invokeOne(function(e){return e.loadNode&&e.loadNode(t)});break;case`mesh`:r=this._invokeOne(function(e){return e.loadMesh&&e.loadMesh(t)});break;case`accessor`:r=this.loadAccessor(t);break;case`bufferView`:r=this._invokeOne(function(e){return e.loadBufferView&&e.loadBufferView(t)});break;case`buffer`:r=this.loadBuffer(t);break;case`material`:r=this._invokeOne(function(e){return e.loadMaterial&&e.loadMaterial(t)});break;case`texture`:r=this._invokeOne(function(e){return e.loadTexture&&e.loadTexture(t)});break;case`skin`:r=this.loadSkin(t);break;case`animation`:r=this._invokeOne(function(e){return e.loadAnimation&&e.loadAnimation(t)});break;case`camera`:r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(n){return n!=this&&n.getDependency&&n.getDependency(e,t)}),!r)throw Error(`Unknown type: `+e)}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,r=this.json[e+(e===`mesh`?`es`:`s`)]||[];t=Promise.all(r.map(function(t,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!==`arraybuffer`)throw Error(`THREE.GLTFLoader: `+t.type+` buffer type is not supported.`);if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[q.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(e,i){n.load(kc.resolveURL(t.uri,r.path),e,void 0,function(){i(Error(`THREE.GLTFLoader: Failed to load buffer "`+t.uri+`".`))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency(`buffer`,t.buffer).then(function(e){let n=t.byteLength||0,r=t.byteOffset||0;return e.slice(r,r+n)})}loadAccessor(e){let t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let e=Pl[r.type],t=jl[r.componentType],n=r.normalized===!0,i=new t(r.count*e);return Promise.resolve(new Pn(i,e,n))}let i=[];return r.bufferView===void 0?i.push(null):i.push(this.getDependency(`bufferView`,r.bufferView)),r.sparse!==void 0&&(i.push(this.getDependency(`bufferView`,r.sparse.indices.bufferView)),i.push(this.getDependency(`bufferView`,r.sparse.values.bufferView))),Promise.all(i).then(function(e){let i=e[0],a=Pl[r.type],o=jl[r.componentType],s=o.BYTES_PER_ELEMENT,c=s*a,l=r.byteOffset||0,u=r.bufferView===void 0?void 0:n.bufferViews[r.bufferView].byteStride,d=r.normalized===!0,f,p;if(u&&u!==c){let e=Math.floor(l/u),n=`InterleavedBuffer:`+r.bufferView+`:`+r.componentType+`:`+e+`:`+r.count,c=t.cache.get(n);c||(f=new o(i,e*u,r.count*u/s),c=new Bo(f,u/s),t.cache.add(n,c)),p=new Ho(c,a,l%u/s,d)}else f=i===null?new o(r.count*a):new o(i,l,r.count*a),p=new Pn(f,a,d);if(r.sparse!==void 0){let t=Pl.SCALAR,n=jl[r.sparse.indices.componentType],s=r.sparse.indices.byteOffset||0,c=r.sparse.values.byteOffset||0,l=new n(e[1],s,r.sparse.count*t),u=new o(e[2],c,r.sparse.count*a);i!==null&&(p=new Pn(p.array.slice(),p.itemSize,p.normalized));for(let e=0,t=l.length;e<t;e++){let t=l[e];if(p.setX(t,u[e*a]),a>=2&&p.setY(t,u[e*a+1]),a>=3&&p.setZ(t,u[e*a+2]),a>=4&&p.setW(t,u[e*a+3]),a>=5)throw Error(`THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.`)}}return p})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,i=t.images[r],a=this.textureLoader;if(i.uri){let e=n.manager.getHandler(i.uri);e!==null&&(a=e)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let r=this,i=this.json,a=i.textures[e],o=i.images[t],s=(o.uri||o.bufferView)+`:`+a.sampler;if(this.textureCache[s])return this.textureCache[s];let c=this.loadImageSource(t,n).then(function(t){t.flipY=!1,t.name=a.name||o.name||``,t.name===``&&typeof o.uri==`string`&&o.uri.startsWith(`data:image/`)===!1&&(t.name=o.uri);let n=(i.samplers||{})[a.sampler]||{};return t.magFilter=Ml[n.magFilter]||1006,t.minFilter=Ml[n.minFilter]||1008,t.wrapS=Nl[n.wrapS]||1e3,t.wrapT=Nl[n.wrapT]||1e3,r.associations.set(t,{textures:e}),t}).catch(function(){return null});return this.textureCache[s]=c,c}loadImageSource(e,t){let n=this,r=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(e=>e.clone());let a=r.images[e],o=self.URL||self.webkitURL,s=a.uri||``,c=!1;if(a.bufferView!==void 0)s=n.getDependency(`bufferView`,a.bufferView).then(function(e){c=!0;let t=new Blob([e],{type:a.mimeType});return s=o.createObjectURL(t),s});else if(a.uri===void 0)throw Error(`THREE.GLTFLoader: Image `+e+` is missing URI and bufferView`);let l=Promise.resolve(s).then(function(e){return new Promise(function(n,r){let a=n;t.isImageBitmapLoader===!0&&(a=function(e){let t=new it(e);t.needsUpdate=!0,n(t)}),t.load(kc.resolveURL(e,i.path),a,void 0,r)})}).then(function(e){return c===!0&&o.revokeObjectURL(s),e.userData.mimeType=a.mimeType||ql(a.uri),e}).catch(function(e){throw console.error(`THREE.GLTFLoader: Couldn't load texture`,s),e});return this.sourceCache[e]=l,l}assignTexture(e,t,n,r){let i=this;return this.getDependency(`texture`,n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),i.extensions[q.KHR_TEXTURE_TRANSFORM]){let e=n.extensions===void 0?void 0:n.extensions[q.KHR_TEXTURE_TRANSFORM];if(e){let t=i.associations.get(a);a=i.extensions[q.KHR_TEXTURE_TRANSFORM].extendTexture(a,e),i.associations.set(a,t)}}return r!==void 0&&(a.colorSpace=r),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,r=t.attributes.tangent===void 0,i=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let e=`PointsMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new ws,An.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,t.sizeAttenuation=!1,this.cache.add(e,t)),n=t}else if(e.isLine){let e=`LineBasicMaterial:`+n.uuid,t=this.cache.get(e);t||(t=new ps,An.prototype.copy.call(t,n),t.color.copy(n.color),t.map=n.map,this.cache.add(e,t)),n=t}if(r||i||a){let e=`ClonedMaterial:`+n.uuid+`:`;r&&(e+=`derivative-tangents:`),i&&(e+=`vertex-colors:`),a&&(e+=`flat-shading:`);let t=this.cache.get(e);t||(t=n.clone(),i&&(t.vertexColors=!0),a&&(t.flatShading=!0),r&&(t.normalScale&&(t.normalScale.y*=-1),t.clearcoatNormalScale&&(t.clearcoatNormalScale.y*=-1)),this.cache.add(e,t),this.associations.set(t,this.associations.get(n))),n=t}e.material=n}getMaterialType(){return Rs}loadMaterial(e){let t=this,n=this.json,r=this.extensions,i=n.materials[e],a,o={},s=i.extensions||{},c=[];if(s[q.KHR_MATERIALS_UNLIT]){let e=r[q.KHR_MATERIALS_UNLIT];a=e.getMaterialType(),c.push(e.extendParams(o,i,t))}else{let n=i.pbrMetallicRoughness||{};if(o.color=new W(1,1,1),o.opacity=1,Array.isArray(n.baseColorFactor)){let e=n.baseColorFactor;o.color.setRGB(e[0],e[1],e[2],se),o.opacity=e[3]}n.baseColorTexture!==void 0&&c.push(t.assignTexture(o,`map`,n.baseColorTexture,oe)),o.metalness=n.metallicFactor===void 0?1:n.metallicFactor,o.roughness=n.roughnessFactor===void 0?1:n.roughnessFactor,n.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,`metalnessMap`,n.metallicRoughnessTexture)),c.push(t.assignTexture(o,`roughnessMap`,n.metallicRoughnessTexture))),a=this._invokeOne(function(t){return t.getMaterialType&&t.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(t){return t.extendMaterialParams&&t.extendMaterialParams(e,o)})))}i.doubleSided===!0&&(o.side=2);let l=i.alphaMode||Rl.OPAQUE;if(l===Rl.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,l===Rl.MASK&&(o.alphaTest=i.alphaCutoff===void 0?.5:i.alphaCutoff)),i.normalTexture!==void 0&&a!==jn&&(c.push(t.assignTexture(o,`normalMap`,i.normalTexture)),o.normalScale=new B(1,1),i.normalTexture.scale!==void 0)){let e=i.normalTexture.scale;o.normalScale.set(e,e)}if(i.occlusionTexture!==void 0&&a!==jn&&(c.push(t.assignTexture(o,`aoMap`,i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&a!==jn){let e=i.emissiveFactor;o.emissive=new W().setRGB(e[0],e[1],e[2],se)}return i.emissiveTexture!==void 0&&a!==jn&&c.push(t.assignTexture(o,`emissiveMap`,i.emissiveTexture,oe)),Promise.all(c).then(function(){let n=new a(o);return i.name&&(n.name=i.name),Vl(n,i),t.associations.set(n,{materials:e}),i.extensions&&Bl(r,n,i),n})}createUniqueName(e){let t=Hc.sanitizeNodeName(e||``);return t in this.nodeNamesUsed?t+`_`+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,r=this.primitiveCache;function i(e){return n[q.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e,t).then(function(n){return Zl(n,e,t)})}let a=[];for(let n=0,o=e.length;n<o;n++){let o=e[n],s=Wl(o),c=r[s];if(c)a.push(c.promise);else{let e;e=o.extensions&&o.extensions[q.KHR_DRACO_MESH_COMPRESSION]?i(o):Zl(new Gn,o,t),r[s]={primitive:o,promise:e},a.push(e)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,r=this.extensions,i=n.meshes[e],a=i.primitives,o=[];for(let e=0,t=a.length;e<t;e++){let t=a[e].material===void 0?zl(this.cache):this.getDependency(`material`,a[e].material);o.push(t)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(n){let o=n.slice(0,n.length-1),s=n[n.length-1],c=[];for(let n=0,l=s.length;n<l;n++){let l=s[n],u=a[n],d,f=o[n];if(u.mode===Al.TRIANGLES||u.mode===Al.TRIANGLE_STRIP||u.mode===Al.TRIANGLE_FAN||u.mode===void 0)d=i.isSkinnedMesh===!0?new Qo(l,f):new lr(l,f),d.isSkinnedMesh===!0&&d.normalizeSkinWeights(),u.mode===Al.TRIANGLE_STRIP?d.geometry=el(d.geometry,1):u.mode===Al.TRIANGLE_FAN&&(d.geometry=el(d.geometry,2));else if(u.mode===Al.LINES)d=new Ss(l,f);else if(u.mode===Al.LINE_STRIP)d=new ys(l,f);else if(u.mode===Al.LINE_LOOP)d=new Cs(l,f);else if(u.mode===Al.POINTS)d=new ks(l,f);else throw Error(`THREE.GLTFLoader: Primitive mode unsupported: `+u.mode);Object.keys(d.geometry.morphAttributes).length>0&&Ul(d,i),d.name=t.createUniqueName(i.name||`mesh_`+e),Vl(d,i),u.extensions&&Bl(r,d,u),t.assignFinalMaterial(d),c.push(d)}for(let n=0,r=c.length;n<r;n++)t.associations.set(c[n],{meshes:e,primitives:n});if(c.length===1)return i.extensions&&Bl(r,c[0],i),c[0];let l=new Ao;i.extensions&&Bl(r,l,i),t.associations.set(l,{meshes:e});for(let e=0,t=c.length;e<t;e++)l.add(c[e]);return l})}loadCamera(e){let t,n=this.json.cameras[e],r=n[n.type];if(!r)console.warn(`THREE.GLTFLoader: Missing camera parameters.`);else return n.type===`perspective`?t=new Sr(Re.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type===`orthographic`&&(t=new Kr(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Vl(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let e=0,r=t.joints.length;e<r;e++)n.push(this._loadNodeShallow(t.joints[e]));return t.inverseBindMatrices===void 0?n.push(null):n.push(this.getDependency(`accessor`,t.inverseBindMatrices)),Promise.all(n).then(function(e){let n=e.pop(),r=e,i=[],a=[];for(let e=0,o=r.length;e<o;e++){let o=r[e];if(o){i.push(o);let t=new U;n!==null&&t.fromArray(n.array,e*16),a.push(t)}else console.warn(`THREE.GLTFLoader: Joint "%s" could not be found.`,t.joints[e])}return new rs(i,a)})}loadAnimation(e){let t=this.json,n=this,r=t.animations[e],i=r.name?r.name:`animation_`+e,a=[],o=[],s=[],c=[],l=[];for(let e=0,t=r.channels.length;e<t;e++){let t=r.channels[e],n=r.samplers[t.sampler],i=t.target,u=i.node,d=r.parameters===void 0?n.input:r.parameters[n.input],f=r.parameters===void 0?n.output:r.parameters[n.output];i.node!==void 0&&(a.push(this.getDependency(`node`,u)),o.push(this.getDependency(`accessor`,d)),s.push(this.getDependency(`accessor`,f)),c.push(n),l.push(i))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(s),Promise.all(c),Promise.all(l)]).then(function(e){let t=e[0],r=e[1],a=e[2],o=e[3],s=e[4],c=[];for(let e=0,i=t.length;e<i;e++){let i=t[e],l=r[e],u=a[e],d=o[e],f=s[e];if(i===void 0)continue;i.updateMatrix&&i.updateMatrix();let p=n._createAnimationTracks(i,l,u,d,f);if(p)for(let e=0;e<p.length;e++)c.push(p[e])}return new rc(i,void 0,c)})}createNodeMesh(e){let t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency(`mesh`,r.mesh).then(function(e){let t=n._getNodeRef(n.meshCache,r.mesh,e);return r.weights!==void 0&&t.traverse(function(e){if(e.isMesh)for(let t=0,n=r.weights.length;t<n;t++)e.morphTargetInfluences[t]=r.weights[t]}),t})}loadNode(e){let t=this.json,n=this,r=t.nodes[e],i=n._loadNodeShallow(e),a=[],o=r.children||[];for(let e=0,t=o.length;e<t;e++)a.push(n.getDependency(`node`,o[e]));let s=r.skin===void 0?Promise.resolve(null):n.getDependency(`skin`,r.skin);return Promise.all([i,Promise.all(a),s]).then(function(e){let t=e[0],n=e[1],r=e[2];r!==null&&t.traverse(function(e){e.isSkinnedMesh&&e.bind(r,Jl)});for(let e=0,r=n.length;e<r;e++)t.add(n[e]);return t})}_loadNodeShallow(e){let t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let i=t.nodes[e],a=i.name?r.createUniqueName(i.name):``,o=[],s=r._invokeOne(function(t){return t.createNodeMesh&&t.createNodeMesh(e)});return s&&o.push(s),i.camera!==void 0&&o.push(r.getDependency(`camera`,i.camera).then(function(e){return r._getNodeRef(r.cameraCache,i.camera,e)})),r._invokeAll(function(t){return t.createNodeAttachment&&t.createNodeAttachment(e)}).forEach(function(e){o.push(e)}),this.nodeCache[e]=Promise.all(o).then(function(t){let o;if(o=i.isBone===!0?new $o:t.length>1?new Ao:t.length===1?t[0]:new dn,o!==t[0])for(let e=0,n=t.length;e<n;e++)o.add(t[e]);if(i.name&&(o.userData.name=i.name,o.name=a),Vl(o,i),i.extensions&&Bl(n,o,i),i.matrix!==void 0){let e=new U;e.fromArray(i.matrix),o.applyMatrix4(e)}else i.translation!==void 0&&o.position.fromArray(i.translation),i.rotation!==void 0&&o.quaternion.fromArray(i.rotation),i.scale!==void 0&&o.scale.fromArray(i.scale);return r.associations.has(o)||r.associations.set(o,{}),r.associations.get(o).nodes=e,o}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],r=this,i=new Ao;n.name&&(i.name=r.createUniqueName(n.name)),Vl(i,n),n.extensions&&Bl(t,i,n);let a=n.nodes||[],o=[];for(let e=0,t=a.length;e<t;e++)o.push(r.getDependency(`node`,a[e]));return Promise.all(o).then(function(e){for(let t=0,n=e.length;t<n;t++)i.add(e[t]);return r.associations=(e=>{let t=new Map;for(let[e,n]of r.associations)(e instanceof An||e instanceof it)&&t.set(e,n);return e.traverse(e=>{let n=r.associations.get(e);n!=null&&t.set(e,n)}),t})(i),i})}_createAnimationTracks(e,t,n,r,i){let a=[],o=e.name?e.name:e.uuid,s=[];Il[i.path]===Il.weights?e.traverse(function(e){e.morphTargetInfluences&&s.push(e.name?e.name:e.uuid)}):s.push(o);let c;switch(Il[i.path]){case Il.weights:c=Qs;break;case Il.rotation:c=ec;break;case Il.position:case Il.scale:c=nc;break;default:switch(n.itemSize){case 1:c=Qs;break;default:c=nc}}let l=r.interpolation===void 0?A:Ll[r.interpolation],u=this._getArrayFromAccessor(n);for(let e=0,n=s.length;e<n;e++){let n=new c(s[e]+`.`+Il[i.path],t.array,u,l);r.interpolation===`CUBICSPLINE`&&this._createCubicSplineTrackInterpolant(n),a.push(n)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let e=Kl(t.constructor),n=new Float32Array(t.length);for(let r=0,i=t.length;r<i;r++)n[r]=t[r]*e;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(e){return new(this instanceof ec?kl:Dl)(this.times,this.values,this.getValueSize()/3,e)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Xl(e,t,n){let r=t.attributes,i=new pt;if(r.POSITION!==void 0){let e=n.json.accessors[r.POSITION],t=e.min,a=e.max;if(t!==void 0&&a!==void 0){if(i.set(new H(t[0],t[1],t[2]),new H(a[0],a[1],a[2])),e.normalized){let t=Kl(jl[e.componentType]);i.min.multiplyScalar(t),i.max.multiplyScalar(t)}}else{console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`);return}}else return;let a=t.targets;if(a!==void 0){let e=new H,t=new H;for(let r=0,i=a.length;r<i;r++){let i=a[r];if(i.POSITION!==void 0){let r=n.json.accessors[i.POSITION],a=r.min,o=r.max;if(a!==void 0&&o!==void 0){if(t.setX(Math.max(Math.abs(a[0]),Math.abs(o[0]))),t.setY(Math.max(Math.abs(a[1]),Math.abs(o[1]))),t.setZ(Math.max(Math.abs(a[2]),Math.abs(o[2]))),r.normalized){let e=Kl(jl[r.componentType]);t.multiplyScalar(e)}e.max(t)}else console.warn(`THREE.GLTFLoader: Missing min/max properties for accessor POSITION.`)}}i.expandByVector(e)}e.boundingBox=i;let o=new jt;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,e.boundingSphere=o}function Zl(e,t,n){let r=t.attributes,i=[];function a(t,r){return n.getDependency(`accessor`,t).then(function(t){e.setAttribute(r,t)})}for(let t in r){let n=Fl[t]||t.toLowerCase();n in e.attributes||i.push(a(r[t],n))}if(t.indices!==void 0&&!e.index){let r=n.getDependency(`accessor`,t.indices).then(function(t){e.setIndex(t)});i.push(r)}return Ye.workingColorSpace!==`srgb-linear`&&`COLOR_0`in r&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ye.workingColorSpace}" not supported.`),Vl(e,t),Xl(e,t,n),Promise.all(i).then(function(){return t.targets===void 0?e:Hl(e,t.targets,n)})}var Ql=(function(){var e=`b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q;iekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq:P8Yqdbk;3sezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhDcbhqinaqae9pmeaDaeaq9RaqaDfae6Egkcsfgocl4cifcd4hxdndndndnaoc9WGgmTmbcbhPcehsawcjdfhzalhHinaraH9Rax6midnaraHaxfgl9RcK6mbczhoinawcj;cbfaogifgoc9WfhOdndndndndnaHaic9WfgAco4fRbbaAci4coG4ciGPlbedibkaO9cb83ibaOcwf9cb83ibxikaOalRblalRbbgAco4gCaCciSgCE86bbaocGfalclfaCfgORbbaAcl4ciGgCaCciSgCE86bbaocVfaOaCfgORbbaAcd4ciGgCaCciSgCE86bbaoc7faOaCfgORbbaAciGgAaAciSgAE86bbaoctfaOaAfgARbbalRbegOco4gCaCciSgCE86bbaoc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc93faAaCfgARbbaOciGgOaOciSgOE86bbaoc94faAaOfgARbbalRbdgOco4gCaCciSgCE86bbaoc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc97faAaCfgARbbaOciGgOaOciSgOE86bbaoc98faAaOfgORbbalRbiglco4gAaAciSgAE86bbaoc99faOaAfgORbbalcl4ciGgAaAciSgAE86bbaoc9:faOaAfgORbbalcd4ciGgAaAciSgAE86bbaocufaOaAfgoRbbalciGglalciSglE86bbaoalfhlxdkaOalRbwalRbbgAcl4gCaCcsSgCE86bbaocGfalcwfaCfgORbbaAcsGgAaAcsSgAE86bbaocVfaOaAfgORbbalRbegAcl4gCaCcsSgCE86bbaoc7faOaCfgORbbaAcsGgAaAcsSgAE86bbaoctfaOaAfgORbbalRbdgAcl4gCaCcsSgCE86bbaoc91faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc4faOaAfgORbbalRbigAcl4gCaCcsSgCE86bbaoc93faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc94faOaAfgORbbalRblgAcl4gCaCcsSgCE86bbaoc95faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc96faOaAfgORbbalRbvgAcl4gCaCcsSgCE86bbaoc97faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc98faOaAfgORbbalRbogAcl4gCaCcsSgCE86bbaoc99faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc9:faOaAfgORbbalRbrglcl4gAaAcsSgAE86bbaocufaOaAfgoRbbalcsGglalcsSglE86bbaoalfhlxekaOal8Pbb83bbaOcwfalcwf8Pbb83bbalczfhlkdnaiam9pmbaiczfhoaral9RcL0mekkaiam6mialTmidnakTmbawaPfRbbhOcbhoazhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkkazcefhzaPcefgPad6hsalhHaPad9hmexvkkcbhlasceGmdxikalaxad2fhCdnakTmbcbhHcehsawcjdfhminaral9Rax6mialTmdalaxfhlawaHfRbbhOcbhoamhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkamcefhmaHcefgHad6hsaHad9hmbkaChlxikcbhocehsinaral9Rax6mdalTmealaxfhlaocefgoad6hsadao9hmbkaChlxdkcbhlasceGTmekc9:hoxikabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqalmbkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;ebf8Kjjjjbaok;yzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;siliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabavcefciGaiVcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:Ohkxekcjjjj94hkkabavcdfciGaiVcetfak87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:Ohqxekcjjjj94hqkabavcufciGaiVcetfaq87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohqxekcjjjj94hqkabavciGaiVcetfaq87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2geTmbinababydbgdcwtcw91:Yadce91cjjj;8ifcjjj98G::NUdbabclfhbaecufgembkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaiczfhiaeczfheadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklz9Kbb`,t=`b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q;Aekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq;t9tqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk;h8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhwcbhDinaDae9pmeawaeaD9RaDawfae6Egqcsfgoc9WGgkci2hxakcethmaocl4cifcd4hPabaDad2fhscbhzdnincehHalhOcbhAdninaraO9RaP6miavcj;cbfaAak2fhCaOaPfhlcbhidnakc;ab6mbaral9Rc;Gb6mbcbhoinaCaofhidndndndndnaOaoco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklbalczfhlkdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklzalczfhlkdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklaalczfhlkdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalclfaYpQbfaXc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalcwfaYpQbfaXc:q:yjjbfRbbfhlxekaialpbbbpkl8Walczfhlkaoc;abfhiaocjefak0meaihoaral9Rc;Fb0mbkkdndnaiak9pmbaici4hoinaral9RcK6mdaCaifhXdndndndndnaOaico4fRbbaocoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpklbxikaXalpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaXalpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaXalpbbbpklbalczfhlkaocdfhoaiczfgiak6mbkkalTmbaAci6hHalhOaAcefgohAaoclSmdxekkcbhlaHceGmdkdnakTmbavcjdfazfhiavazfpbdbhYcbhXinaiavcj;cbfaXfgopblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLaoakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEaoamfpblbg3cep9Ta3aQp9op9Hp9rg3aoaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfhiaXczfgXak6mbkkazclfgzad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfhDc9:hoalmexikkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk;uzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:EPliuo97eue978Jjjjjbca9Rhidndnadcl9hmbdnaec98GglTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalae9pmeaiaeciGgvcdtgdVcbczad9R;8kbaiabalcdtfglad;8qbbdnavTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkalaiad;8qbbskdnaec98GgxTmbcbhvabhdinadczfglalpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oawaopmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgvax6mbkkaxae9pmbaiaeciGgvcitgdfcbcaad9R;8kbaiabaxcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oawaopmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalae9pmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbhdabheinaeaepbbbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepkbbaeczfheadclfgdav6mbkkdnaval9pmbaialciGgdcdtgeVcbc;abae9R;8kbaiabavcdtfgvae;8qbbdnadTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepklbkavaiae;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz9Tbb`,n=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),r=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!=`object`)return{supported:!1};var i=WebAssembly.validate(n)?t:e,a,o=WebAssembly.instantiate(s(i),{}).then(function(e){a=e.instance,a.exports.__wasm_call_ctors()});function s(e){for(var t=new Uint8Array(e.length),n=0;n<e.length;++n){var i=e.charCodeAt(n);t[n]=i>96?i-97:i>64?i-39:i+4}for(var a=0,n=0;n<e.length;++n)t[a++]=t[n]<60?r[t[n]]:(t[n]-60)*64+t[++n];return t.buffer.slice(0,a)}function c(e,t,n,r,i,o){var s=a.exports.sbrk,c=n+3&-4,l=s(c*r),u=s(i.length),d=new Uint8Array(a.exports.memory.buffer);d.set(i,u);var f=e(l,n,r,u,i.length);if(f==0&&o&&o(l,c,r),t.set(d.subarray(l,l+n*r)),s(l-s(0)),f!=0)throw Error(`Malformed buffer data: `+f)}var l={NONE:``,OCTAHEDRAL:`meshopt_decodeFilterOct`,QUATERNION:`meshopt_decodeFilterQuat`,EXPONENTIAL:`meshopt_decodeFilterExp`},u={ATTRIBUTES:`meshopt_decodeVertexBuffer`,TRIANGLES:`meshopt_decodeIndexBuffer`,INDICES:`meshopt_decodeIndexSequence`},d=[],f=0;function p(e){var t={object:new Worker(e),pending:0,requests:{}};return t.object.onmessage=function(e){var n=e.data;t.pending-=n.count,t.requests[n.id][n.action](n.value),delete t.requests[n.id]},t}function m(e){for(var t=`var instance; var ready = WebAssembly.instantiate(new Uint8Array([`+new Uint8Array(s(i))+`]), {}).then(function(result) { instance = result.instance; instance.exports.__wasm_call_ctors(); });self.onmessage = workerProcess;`+c.toString()+g.toString(),n=new Blob([t],{type:`text/javascript`}),r=URL.createObjectURL(n),a=0;a<e;++a)d[a]=p(r);URL.revokeObjectURL(r)}function h(e,t,n,r,i){for(var a=d[0],o=1;o<d.length;++o)d[o].pending<a.pending&&(a=d[o]);return new Promise(function(o,s){var c=new Uint8Array(n),l=f++;a.pending+=e,a.requests[l]={resolve:o,reject:s},a.object.postMessage({id:l,count:e,size:t,source:c,mode:r,filter:i},[c.buffer])})}function g(e){o.then(function(){var t=e.data;try{var n=new Uint8Array(t.count*t.size);c(a.exports[t.mode],n,t.count,t.size,t.source,a.exports[t.filter]),self.postMessage({id:t.id,count:t.count,action:`resolve`,value:n},[n.buffer])}catch(e){self.postMessage({id:t.id,count:t.count,action:`reject`,value:e})}})}return{ready:o,supported:!0,useWorkers:function(e){m(e)},decodeVertexBuffer:function(e,t,n,r,i){c(a.exports.meshopt_decodeVertexBuffer,e,t,n,r,a.exports[l[i]])},decodeIndexBuffer:function(e,t,n,r){c(a.exports.meshopt_decodeIndexBuffer,e,t,n,r)},decodeIndexSequence:function(e,t,n,r){c(a.exports.meshopt_decodeIndexSequence,e,t,n,r)},decodeGltfBuffer:function(e,t,n,r,i,o){c(a.exports[u[i]],e,t,n,r,a.exports[l[o]])},decodeGltfBufferAsync:function(e,t,n,r,i){return d.length>0?h(e,t,n,u[r],l[i]):o.then(function(){var o=new Uint8Array(e*t);return c(a.exports[u[r]],o,e,t,n,a.exports[l[i]]),o})}}})(),$l=`/Nasa_space_app/rover/`,eu={meta:{gravity:{earth:9.81}},manifest:{demo:!1,note:``},rovers:null};function tu(e,t,n){let r=t*t,i=new Float32Array(r),a=0;for(let o=0;o<t;o++){let s=a=a+(e[o*t]|e[r+o*t]<<8)&65535;i[o*t]=s*n;for(let a=1;a<t;a++){let c=o*t+a;s=s+(e[c]|e[r+c]<<8)&65535,i[c]=s*n}}return i}function nu(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return t>>>0}function ru(e){return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function iu(e,t,n){let r=new Float32Array(t*t);for(let i=0;i<t;i++)for(let a=0;a<t;a++){let o=Math.max(0,i-1),s=Math.min(t-1,i+1),c=Math.max(0,a-1),l=Math.min(t-1,a+1),u=(e[s*t+a]-e[o*t+a])/((s-o)*n),d=(e[i*t+l]-e[i*t+c])/((l-c)*n);r[i*t+a]=Math.atan(Math.hypot(d,u))*180/Math.PI}return r}function au(e){let t=Array.from(e).sort((e,t)=>e-t);return t[Math.floor(t.length/2)]}function ou(e,t){let n=Array.from(e).sort((e,t)=>e-t);return n[Math.min(n.length-1,Math.floor(t*n.length))]}function su(e,t){let n=new Float32Array(t*t);for(let r=1;r<t-1;r++)for(let i=1;i<t-1;i++){let a=0;for(let n=-1;n<=1;n++)for(let o=-1;o<=1;o++)a+=e[(r+n)*t+i+o];n[r*t+i]=Math.abs(e[r*t+i]-a/9)}return n}function cu(e,t,n,r,i,a){let o=n/(t-1),s=1/0,c=-1/0;for(let e of r)e<s&&(s=e),e>c&&(c=e);if(s!==0&&!(a&&a.real)){for(let e=0;e<r.length;e++)r[e]-=s;c-=s,s=0}let l=iu(r,t,o);return{id:e,n:t,size:n,dx:o,h:r,slope:l,rough:su(r,t),min:s,max:c,kind:i,stats:{slope_med:au(l),slope_p90:ou(l,.9),relief:c-s},...a}}function lu(e,t,n,r,i){let a=n.M,o=(a-1)/(t-1),s=new Float32Array(t*t);for(let e=0;e<t;e++)for(let r=0;r<t;r++)s[e*t+r]=n.h[e*o*a+r*o];let c=cu(e,t,n.size,s,`earth`,{synthetic:!!i.synthetic_fine,syntheticBase:!1,real:!0,prov:i});return c.U={M:a,h:n.h,dx:n.size/(a-1),size:n.size,real:!0},c.C={n:r.n,size:r.size,dx:r.size/(r.n-1),h:r.h},c}function uu(e){if(e.U)return e.U;let t=e.n,n=2*t-1,r=e.h,i=new Float32Array(t*n),a=new Float32Array(n*n),o=(e,t,n,r)=>(-e+9*t+9*n-r)/16,s=e=>Math.max(0,Math.min(t-1,e));for(let e=0;e<t;e++)for(let a=0;a<t;a++)i[e*n+2*a]=r[e*t+a],a<t-1&&(i[e*n+2*a+1]=o(r[e*t+s(a-1)],r[e*t+a],r[e*t+a+1],r[e*t+s(a+2)]));for(let e=0;e<n;e++)for(let r=0;r<t;r++)a[2*r*n+e]=i[r*n+e],r<t-1&&(a[(2*r+1)*n+e]=o(i[s(r-1)*n+e],i[r*n+e],i[(r+1)*n+e],i[s(r+2)*n+e]));let c=e.dx/2;return e.U={M:n,h:a,dx:c,size:e.size,slope:iu(a,n,c)},e.U}function du(e,t,n,r,i){let a=Math.max(0,Math.min(t-1.000001,r/n)),o=Math.max(0,Math.min(t-1.000001,i/n)),s=Math.floor(a),c=Math.floor(o),l=a-s,u=o-c,d=c*t+s;return l+u<=1?e[d]+(e[d+1]-e[d])*l+(e[d+t]-e[d])*u:e[d+t+1]+(e[d+t]-e[d+t+1])*(1-l)+(e[d+1]-e[d+t+1])*(1-u)}function fu(e,t,n){let r=uu(e),i=.5*t,a=.5*n;return(e,t,n=1,o=0)=>{let s=-1/0,c=o,l=-n;for(let u=-1;u<=1;u++)for(let d=-1;d<=1;d++){let f=du(r.h,r.M,r.dx,e+u*i*n+d*a*c,t+u*i*o+d*a*l);f>s&&(s=f)}return s}}function pu(e,t,n){let r=uu(e);return du(r.h,r.M,r.dx,t,n)}function mu(e,t,n){let r=e.size/2;if(Math.abs(t)<=r&&Math.abs(n)<=r)return pu(e,t+r,n+r);if(e.C)return du(e.C.h,e.C.n,e.C.dx,t+e.C.size/2,n+e.C.size/2);let i=t=>{let n=((t/e.size+.5)%2+2)%2;return n>1&&(n=2-n),n*e.size};return pu(e,i(t),i(n))}function hu(e){let t=e?.soil??.5,n=e?.dust??.5;return t>=.7?`rocky`:n>=.5?`fine_regolith`:`sand`}var gu=(e,t)=>(e.kc/t+e.kphi)*1e3;function _u(e,t,n,r){if(!(r>0))return{z:0,L:0,p:0};let i=gu(e,t),a=a=>t*2*Math.sqrt(Math.max(0,2*n*a-a*a))*i*a**+e.n-r,o=1e-9,s=n*.95;if(a(s)<0)return{z:s,L:2*Math.sqrt(2*n*s-s*s),p:r/(t*2*Math.sqrt(2*n*s-s*s))};for(let e=0;e<40;e++){let e=(o+s)/2;a(e)>0?s=e:o=e}let c=(o+s)/2,l=2*Math.sqrt(2*n*c-c*c);return{z:c,L:l,p:r/(t*l)}}function vu(e,t,n){return t*gu(e,t)*n**+(e.n+1)/(e.n+1)}var yu=class{constructor(e,t){this.b=e.wheel_width_m,this.r=e.wheel_radius_m,this.n=e.n_wheels,this.S=t,this._N=-1,this.z=0,this.p=0,this.Rc=0}at(e){if(this._N<0||Math.abs(e-this._N)>.004*this._N){let t=_u(this.S,this.b,this.r,e/this.n);this.z=t.z,this.p=t.p,this.Rc=this.n*vu(this.S,this.b,t.z),this._N=e}return this}};function bu(e,t,{g:n,mu:r,crr:i,mass:a}){let o=(a??e.mass_kg)*n,s=_u(t,e.wheel_width_m,e.wheel_radius_m,o/e.n_wheels),c=e.n_wheels*vu(t,e.wheel_width_m,s.z),l=i*o+c,u=e.max_speed_mps,d=t=>Math.min(e.drive_force_max_N*Math.max(0,1-t/u),e.drive_power_max_W/Math.max(t,.01),r*o),f=0,p=u,m;if(d(.001)<=l)m=0;else{for(let e=0;e<50;e++){let e=(f+p)/2;d(e)>l?f=e:p=e}m=f}let h=l*Math.max(m,1e-6)/e.drive_efficiency+e.base_power_W;return{weightN:o,wheelLoadN:o/e.n_wheels,pressure_kPa:s.p/1e3,sinkage_m:s.z,sinkage_over_radius:s.z/e.wheel_radius_m,contact_length_m:s.L,resistanceN:l,compactionN:c,topSpeed:m,powerW:h,rangeM:m>0?e.battery_wh*3600/h*m:0,jPerM:m>0?h/m:1/0,canMove:m>0}}var xu=Math.PI/180,Su=[.12,.5],Cu=[.88,.5];function wu(e){return Math.max(.25,Math.min(.95,.35+.5*e))}var Tu=class{constructor(){this.a=[]}push(e,t){let n=this.a;n.push([e,t]);let r=n.length-1;for(;r>0;){let e=r-1>>1;if(n[e][0]<=n[r][0])break;[n[e],n[r]]=[n[r],n[e]],r=e}}pop(){let e=this.a,t=e[0],n=e.pop();if(e.length){e[0]=n;let t=0;for(;;){let n=2*t+1,r=n+1,i=t;if(n<e.length&&e[n][0]<e[i][0]&&(i=n),r<e.length&&e[r][0]<e[i][0]&&(i=r),i===t)break;[e[i],e[t]]=[e[t],e[i]],t=i}}return t}get size(){return this.a.length}},Eu=new WeakMap,Du=new WeakMap,Ou=[`mass_kg`,`n_wheels`,`wheel_radius_m`,`wheel_width_m`,`max_speed_mps`,`drive_power_max_W`,`drive_force_max_N`,`battery_wh`,`base_power_W`,`drive_efficiency`,`slope_limit_deg`,`ground_clearance_m`,`wheelbase_m`,`track_m`];function ku(e,t,n,r){let i=e.get(t);if(i||e.set(t,i=new Map),i.has(n)){let e=i.get(n);return i.delete(n),i.set(n,e),e}let a=r();return i.set(n,a),i.size>16&&i.delete(i.keys().next().value),a}var Au=(e,t)=>ku(Eu,e,t.slope_limit_deg,()=>ju(e,t));function ju(e,t){let n=e.n,r=Math.tan(t.slope_limit_deg*xu),i=Array.from(e.rough).sort((e,t)=>e-t),a=Math.max(.001,i[i.length>>1]),o=new Float32Array(n*n);for(let t=0;t<n*n;t++){let n=Math.tan(e.slope[t]*xu)/r;o[t]=1+6*n*n+.25*Math.min(4,e.rough[t]/a)+(n>1.2?60:0)}let s=(e,t)=>e*n+t,c=[Math.round(Su[1]*(n-1)),Math.round(Su[0]*(n-1))],l=[Math.round(Cu[1]*(n-1)),Math.round(Cu[0]*(n-1))],u=new Float32Array(n*n).fill(1/0),d=new Int32Array(n*n).fill(-1),f=new Tu;u[s(...c)]=0,f.push(0,s(...c));let p=(e,t)=>Math.hypot(e-l[0],t-l[1]);for(;f.size;){let[,e]=f.pop(),t=e/n|0,r=e%n;if(t===l[0]&&r===l[1])break;for(let i=-1;i<=1;i++)for(let a=-1;a<=1;a++){if(!i&&!a)continue;let c=t+i,l=r+a;if(c<0||l<0||c>=n||l>=n)continue;let m=s(c,l),h=Math.hypot(i,a)*.5*(o[e]+o[m]),g=u[e]+h;g<u[m]&&(u[m]=g,d[m]=e,f.push(g+p(c,l),m))}}let m=[],h=s(...l);if(d[h]<0&&h!==s(...c))return null;for(;h>=0;)m.push([h%n*e.dx,(h/n|0)*e.dx]),h=d[h];m.reverse();for(let e=0;e<8;e++)m=m.map((e,t)=>{if(t===0||t===m.length-1)return e;let n=m[Math.max(0,t-2)],r=m[Math.min(m.length-1,t+2)];return[(n[0]+e[0]*2+r[0])/4,(n[1]+e[1]*2+r[1])/4]});let g=[m[0]],_=0;for(let e=1;e<m.length;e++){let[t,n]=m[e-1],[r,i]=m[e],a=Math.hypot(r-t,i-n);for(;_+a>=2;){let e=(2-_)/a;t+=(r-t)*e,n+=(i-n)*e,g.push([t,n]),a=Math.hypot(r-t,i-n),_=0}_+=a}return g}function Mu(e){return .06+.12*(1-e)}function Nu(e){if(e.wheel_pts)return e.wheel_pts;let t=e.track_m/2,n=e.wheelbase_m/2,r=[[n,t],[n,-t],[-n,t],[-n,-t]];if(e.n_wheels===6){let n=e.mid_wheel_x_m||t;r.push([0,n],[0,-n])}return r}function Pu(e,t,n,r,i,a){let o=i.length,s=Math.cos(r),c=Math.sin(r),l=c,u=-s,d=a||{},f=d.H||=[],p=0,m=0,h=0,g=0,_=0;f.length=o;for(let r=0;r<o;r++){let a=i[r][0],d=i[r][1],v=e(t+a*s+d*l,n+a*c+d*u,s,c);f[r]=v,p+=v/o,m+=v*a,h+=v*d,g+=a*a,_+=d*d}let v=m/g,y=h/_,b=0;for(let e=0;e<o;e++){let t=f[e]-(p+v*i[e][0]+y*i[e][1]);b+=t*t}return d.c=p,d.sa=v,d.sb=y,d.resid=Math.sqrt(b/o),d.fx=s,d.fz=c,d.rx=l,d.rz=u,d}function Fu(e,t,n,r){let{g:i,mass:a,mu:o,soil:s,S:c}=r;return ku(Du,t,Ou.map(e=>n[e]).join(`,`)+`|`+(n.wheel_pts?n.wheel_pts.map(e=>e[0]+`:`+e[1]).join(`;`):``)+`|${i},${a},${o},${s},${c?c.n+`,`+c.kc+`,`+c.kphi:``}`,()=>Iu(e,t,n,r))}function Iu(e,t,n,{g:r,mass:i,mu:a,soil:o,S:s}){let c=t.length,l=Nu(n),u=l.length,d={n:c,x:new Float32Array(c),z:new Float32Array(c),c:new Float32Array(c),nx:new Float32Array(c),ny:new Float32Array(c),nz:new Float32Array(c),psi:new Float32Array(c),tilt:new Float32Array(c),pitch:new Float32Array(c),roll:new Float32Array(c),slip:new Float32Array(c),e:new Float32Array(c),v:new Float32Array(c),t:new Float32Array(c),E:new Float32Array(c),s:new Float32Array(c),fwd:new Float32Array(c),resid:new Float32Array(c)},f=fu(e,n.wheel_radius_m,n.wheel_width_m||.3),p=Mu(o),m=n.max_speed_mps,h=n.slope_limit_deg*xu,g=s?new yu({...n,n_wheels:u},s):null,_=new Float32Array(c),v=new Float32Array(c),y=new Uint8Array(c);d.sink=_,d.press=v,d.blocked=y;for(let e=0;e<c;e++){let[o,s]=t[e],u=t[Math.max(0,e-1)],b=t[Math.min(c-1,e+1)],x=Math.atan2(b[1]-u[1],b[0]-u[0]),S=Math.cos(x),C=Math.sin(x),w=C,T=-S,{c:E,sa:D,sb:O,resid:k}=Pu(f,o,s,x,l),A=D*S+O*w,j=D*C+O*T,ee=Math.hypot(A,1,j),M=Math.atan(Math.hypot(D,O)),N=Math.min(1,(Math.tan(M)/a)**2.5),te=D/Math.hypot(1,D),ne=i*r*Math.cos(M),re=g?g.at(ne):null,ie=re?re.Rc:0,ae=p*ne+ie,oe=i*r*Math.max(0,te),se=(i*r*(p*Math.cos(Math.atan(D))+Math.max(0,te))+ie)/n.drive_efficiency/(1-.5*N),ce=m*Math.max(.12,Math.min(1,1-M/(h*1.2)))*Math.max(.35,Math.min(1,1-1.5*k/n.wheel_radius_m));if(ce=Math.min(ce,Math.max(.12*m,n.drive_power_max_W/Math.max(ae+oe,1e-6))),_[e]=re?re.z:0,v[e]=re?re.p/1e3:0,y[e]=+(ae+oe>Math.min(n.drive_force_max_N,a*ne)),d.x[e]=o,d.z[e]=s,d.c[e]=E,d.nx[e]=-A/ee,d.ny[e]=1/ee,d.nz[e]=-j/ee,d.psi[e]=x,d.pitch[e]=Math.atan(D)/xu,d.roll[e]=Math.atan(O)/xu,d.tilt[e]=M/xu,d.slip[e]=N*100,d.e[e]=se,d.v[e]=ce,d.fwd[e]=D,d.resid[e]=k,e){let n=Math.hypot(o-t[e-1][0],s-t[e-1][1]);d.s[e]=d.s[e-1]+n,d.t[e]=d.t[e-1]+n/ce,d.E[e]=d.E[e-1]+se*n}}let b=e=>e.reduce((e,t)=>e+t,0)/e.length,x=(d.E[c-1]+n.base_power_W*d.t[c-1])/3600,S=y.reduce((e,t)=>e+t,0),C=[];S/c>.05&&C.push(`cannot climb or push through on ${(100*S/c).toFixed(0)} % of the route`),x>n.battery_wh&&C.push(`battery too small (${x.toFixed(0)} Wh needed, ${n.battery_wh.toFixed(0)} Wh available)`);let w=[...d.tilt].sort((e,t)=>e-t)[Math.floor(.98*(c-1))];return w>n.slope_limit_deg&&C.push(`route tilt ${w.toFixed(0)}° (98th percentile) exceeds the ${n.slope_limit_deg}° slope limit`),Math.max(..._)>=n.ground_clearance_m&&C.push(`sinks deeper than its ground clearance`),d.totals={energy_Wh:x,battery_wh:n.battery_wh,reachable:!C.length,blockers:C,sink_mean_mm:1e3*b(_),sink_max_mm:1e3*Math.max(..._),press_kPa:b(v),blocked_frac:S/c,dist:d.s[c-1],time:d.t[c-1],energy:d.E[c-1],tilt_mean:b(d.tilt),tilt_max:Math.max(...d.tilt),slip_mean:b(d.slip),slip_max:Math.max(...d.slip),e_mean:d.E[c-1]/Math.max(1,d.s[c-1]),load_N:i*r*Math.cos(b(d.tilt)*xu)/u,max_climb_deg:Math.atan(a)/xu,mass:i,g:r,mu:a},d}function Lu(e,t,n=100){let r=new Float32Array(n);for(let i=0;i<n;i++){let a=i/(n-1)*(e.n-1),o=Math.floor(a),s=a-o;r[i]=e[t][o]*(1-s)+e[t][Math.min(e.n-1,o+1)]*s}return r}function Ru(e,t){let n=0;for(let r=0;r<e.length;r++)n+=Math.abs(e[r]-t[r]);return n/e.length}function zu(e,t){let n=0;for(let r=0;r<e.length;r++)n+=Math.abs(e[r]-t[r])/Math.max(1e-9,Math.abs(e[r]),Math.abs(t[r]));return n/e.length}var Bu=e=>Math.max(0,Math.min(100,e));function Vu(e,t,n,r){let i=Bu(100*(1-Ru(Lu(e,`tilt`),Lu(t,`tilt`))/12)),a=Bu(100*(1-Ru(Lu(e,`slip`),Lu(t,`slip`))/30)),o=Bu(100*(1-zu(Lu(e,`e`),Lu(n,`e`)))),s=Bu(100*(1-Math.abs(e.totals.time-t.totals.time)/Math.max(e.totals.time,t.totals.time))),c=(i+a+o+s)/4,l=r.gEarth/r.gTarget,u=e.totals,d=t.totals,f=n.totals,p=[{key:`tilt`,label:`Mean tilt`,a:u.tilt_mean,b:d.tilt_mean,unit:`°`,score:i,kind:`terrain`},{key:`slip`,label:`Mean slip`,a:u.slip_mean,b:d.slip_mean,unit:`%`,score:a,kind:`terrain`},{key:`energy_eq`,label:`Energy per metre, equal wheel load`,a:u.e_mean,b:f.e_mean,unit:` J/m`,score:o,kind:`terrain`},{key:`time`,label:`Drive time`,a:u.time/60,b:d.time/60,unit:` min`,score:s,kind:`terrain`},{key:`climb`,label:`Friction-limited steepest slope`,a:u.max_climb_deg,b:d.max_climb_deg,unit:`°`,score:Bu(100*(1-Math.abs(u.max_climb_deg-d.max_climb_deg)/15)),kind:`friction`},{key:`energy_raw`,label:`Energy per metre, same mass`,a:u.e_mean,b:d.e_mean,unit:` J/m`,score:null,kind:`gravity`},{key:`load`,label:`Wheel load, same mass`,a:u.load_N,b:d.load_N,unit:` N`,score:null,kind:`gravity`}];u.sink_mean_mm!=null&&p.push({key:`sink`,label:`Wheel sinkage, mean (simplified)`,a:u.sink_mean_mm,b:d.sink_mean_mm,unit:` mm`,score:null,kind:`rover`},{key:`press`,label:`Ground pressure under a wheel`,a:u.press_kPa,b:d.press_kPa,unit:` kPa`,score:null,kind:`rover`},{key:`batt`,label:`Energy used on the route (battery `+Math.round(u.battery_wh)+` Wh)`,a:u.energy_Wh,b:d.energy_Wh,unit:` Wh`,score:null,kind:`rover`}),p.forEach(e=>{e.status=e.kind===`gravity`?`gravity`:e.kind===`rover`?`rover`:e.score>=70?`match`:`mismatch`});let m=[],h=[];u.reachable===!1&&h.push(`This build does not complete the route on the target ground (${(u.blockers||[]).join(`, `)||`battery or traction limit`}). Screening result: the model has no recharging and no detours.`),d.reachable===!1&&h.push(`This build does not complete the route on the Earth site (${(d.blockers||[]).join(`, `)||`battery or traction limit`}). Screening result: the model has no recharging and no detours.`),i<70&&m.push(`Tilt differs: mean ${u.tilt_mean.toFixed(1)}° on the target vs ${d.tilt_mean.toFixed(1)}° on the Earth site.`),a<70&&m.push(`Slip differs: mean ${u.slip_mean.toFixed(0)}% vs ${d.slip_mean.toFixed(0)}% (the slope is compared with each site's friction, so soil matters here).`),o<70&&m.push(`Energy per metre differs even at equal wheel load: ${u.e_mean.toFixed(0)} vs ${f.e_mean.toFixed(0)} J/m (terrain and rolling resistance, not gravity).`),s<70&&m.push(`Drive time differs: ${(u.time/60).toFixed(0)} vs ${(d.time/60).toFixed(0)} min (speed is limited by slope and roughness).`),p[4].status===`mismatch`&&m.push(`The friction-limited steepest slope differs: ${u.max_climb_deg.toFixed(0)}° vs ${d.max_climb_deg.toFixed(0)}°. This depends on soil friction, not gravity.`);let g=p.filter(e=>e.score!=null).sort((e,t)=>e.score-t.score)[0],_={tilt:`Look for an Earth place with a lower steep-slope (p90) value or lower relief.`,slip:`Adjust the friction sliders or choose a site with similar soil competence.`,energy_eq:`Check soil cover and slope: rolling resistance and uphill grade drive energy.`,time:`Compare slope and roughness of the two routes.`,climb:`Set the friction values deliberately; the geology class sets the default.`}[g.key],v=c>=80?`Good match`:c>=60?`Partial match`:`Weak match`,y=`Gravity differs (${r.gTarget} vs ${r.gEarth} m/s², ratio ${l.toFixed(2)}). Wheel load and energy per metre scale with gravity at equal mass (here ${(d.load_N/u.load_N).toFixed(2)}x and ${(d.e_mean/u.e_mean).toFixed(2)}x), so they differ by design, while tilt, slip, friction-limited slope and drive time do not depend on gravity in this model. A test mass of about ${(r.gTarget/r.gEarth).toFixed(2)} times the rover mass reproduces the target wheel load on Earth.`;return m.push(...h),{match:c,label:v,rows:p,mismatches:m,recommendation:c>=80&&!m.length?`The two drives behave alike on the terrain-driven metrics. Use this site for screening tests, keeping the gravity differences in mind.`:`Main mismatch: ${g.label.toLowerCase()}. ${_}`,gravityNote:y}}var Hu=new V,Uu=new H,Wu=new H,Gu=new H,Ku=new H,qu=new U,Ju=new ut;new H,new H;var Yu=new H,Xu=(e,t,n)=>Math.max(t,Math.min(n,e)),Zu=.12,Qu=(e,t)=>Xu(e||0,0,Zu*t),$u=1/120,ed=72,td=4,nd=3;function rd(e){if(e.userData.rim&&e.userData.rim.rep instanceof Float32Array)return e.userData.rim;e.updateWorldMatrix(!0,!0);let t=new U().copy(e.matrixWorld).invert(),n=e.scale,r=new H,i=new U,a=[],o=1/0,s=-1/0,c=0;e.traverse(e=>{if(!e.isMesh||!e.visible)return;i.multiplyMatrices(t,e.matrixWorld);let l=e.geometry.attributes.position;for(let e=0;e<l.count;e++){r.fromBufferAttribute(l,e).applyMatrix4(i);let t=Math.hypot(r.y*n.y,r.z*n.z);a.push([r.x,r.y,r.z,t]),r.x<o&&(o=r.x),r.x>s&&(s=r.x),t>c&&(c=t)}});let l=Array.from({length:288*nd},()=>[]);for(let e of a){if(e[3]<.6*c)continue;let t=Math.floor((Math.atan2(e[2],e[1])+Math.PI)/(2*Math.PI)*ed)%ed,n=Math.min(3,Math.floor((e[0]-o)/Math.max(1e-9,s-o)*td)),r=Math.min(2,Math.floor((e[3]/c-.6)/.4*nd));l[(t*td+n)*nd+r].push(e)}let u=l.filter(e=>e.length),d=u.length,f=new Float32Array(d*3),p=new Float32Array(d),m=new Int32Array(d+1),h=new Float32Array(u.reduce((e,t)=>e+t.length,0)*3),g=0;u.forEach((e,t)=>{let n=e[0];f.set(n.slice(0,3),t*3),m[t]=g/3;let r=0;for(let t of e)h[g++]=t[0],h[g++]=t[1],h[g++]=t[2],r=Math.max(r,Math.hypot(t[0]-n[0],t[1]-n[1],t[2]-n[2]));p[t]=r}),m[d]=g/3;let _=0;for(let e=0;e<h.length;e+=3)_=Math.max(_,Math.hypot(h[e],h[e+1],h[e+2]));return e.userData.rim={rep:f,dmax:p,start:m,all:h,reach:_,cl:new Float32Array(d)}}function id(e,t,n,r,i){let a=e.matrixWorld.elements,o=n.h,s=n.M,c=n.dx,l=t.cl,u=l.length,d=Math.max(Math.hypot(a[0],a[1],a[2]),Math.hypot(a[4],a[5],a[6]),Math.hypot(a[8],a[9],a[10])),f=t.reach*d+c,p=Math.round((a[14]+r)/c),m=Math.round((a[12]+r)/c),h=Math.ceil(f/c),g=0;for(let e=Math.max(0,p-h);e<Math.min(s-1,p+h);e++)for(let t=Math.max(0,m-h);t<Math.min(s-1,m+h);t++){let n=e*s+t,r=o[n],i=o[n+1],a=o[n+s],c=o[n+s+1];g=Math.max(g,Math.abs(i-r),Math.abs(a-r),Math.abs(c-a),Math.abs(c-i),Math.abs(i-a))}let _=1+Math.SQRT2*g/c*i,v=(e,t)=>{let n=e[t],l=e[t+1],u=e[t+2];return a[1]*n+a[5]*l+a[9]*u+a[13]-du(o,s,c,a[0]*n+a[4]*l+a[8]*u+a[12]+r,a[2]*n+a[6]*l+a[10]*u+a[14]+r)*i},y=1/0;for(let e=0;e<u;e++)l[e]=v(t.rep,e*3),l[e]<y&&(y=l[e]);for(let e=0;e<u;e++)if(l[e]-t.dmax[e]*d*_<y)for(let n=t.start[e];n<t.start[e+1];n++){let e=v(t.all,n*3);e<y&&(y=e)}return y}var ad=e=>{e.updateMatrix(),e.matrixWorld.multiplyMatrices(e.parent.matrixWorld,e.matrix)};function od(e,t,n,r,i){let a=e.patch,o=uu(a),s=a.size/2,c=i.ex||1,l=i.par,u=Nu(l),d=l.wheel_radius_m,f=Qu(i.sink,d),p=e.pose,m=l.wheel_radius_m+`,`+l.wheel_width_m;p.sample&&p.sampleKey===m&&p.sampleP===a||(p.sample=fu(a,d,l.wheel_width_m||.3),p.sampleKey=m,p.sampleP=a);let h=Pu(p.sample,t,n,r,u,p.fit||={}),g=h.fx,_=h.fz,v=h.sa*g+h.sb*h.rx,y=h.sa*_+h.sb*h.rz;Uu.set(-v*c,1,-y*c).normalize(),Ku.set(g,0,_),Wu.copy(Ku).addScaledVector(Uu,-Ku.dot(Uu)).normalize(),Gu.crossVectors(Uu,Wu).normalize(),qu.makeBasis(Gu,Uu,Wu),Ju.setFromRotationMatrix(qu);let b=(h.c-f)*c,x=e.rover.root,S=i.snap||!p.init,C=Math.min(.25,i.dt||.016);if(x.position.x=t-s,x.position.z=n-s,S)p.y=b,p.vy=0,p.acc=0,p.q=(p.q||new ut).copy(Ju),p.init=!0;else{p.acc=(p.acc||0)+C;let e=p.y,t=p.vy||0;for(;p.acc>=$u;)t+=(256*(b-e)-32*t)*$u,e+=t*$u,p.acc-=$u;p.y=e,p.vy=t,p.q.slerp(Ju,1-Math.exp(-C*(i.kq||6)))}x.position.y=p.y,x.quaternion.copy(p.q),x.updateWorldMatrix(!0,!1);let w=e.rover.lift,T=e.rover.model;w.updateMatrix(),w.matrixWorld.multiplyMatrices(x.matrixWorld,w.matrix),T.updateMatrix(),T.matrixWorld.multiplyMatrices(w.matrixWorld,T.matrix);let E=e.rover.wheels,D=Yu,O=null,k=null;for(let r=0;r<E.length;r++){let a=E[r],l=a.node;if(!l.visible)continue;let u=rd(l);l.rotation.x=i.wheelAng||0,l.parent!==T&&l.parent.updateWorldMatrix(!0,!1),Hu.setFromMatrix4(l.parent.matrixWorld).invert(),D.set(0,1,0).applyMatrix3(Hu),a.p0||=new H(l.position.x,a.y0,l.position.z),l.position.copy(a.p0),ad(l);let d=0;{let e=id(l,u,o,s,c);d=Math.max(-.4,-f-e),l.position.copy(a.p0).addScaledVector(D,d),ad(l)}if(a.dy=d,a.hanging=d<=-.4+1e-6,e.tracks&&i.moving!==!1){let e=t+a.u*g+a.v*h.rx,r=n+a.u*_+a.v*h.rz;if(a.v<0?!O||a.u<O.u:!k||a.u<k.u){let t={u:a.u,p:[e-s,du(o.h,o.M,o.dx,e,r)*c+.012,r-s]};a.v<0?O=t:k=t}}}return e.tracks&&O&&k&&i.moving!==!1&&e.tracks.add([O.p,k.p],[g,_],l.wheel_width_m||.3,Xu(.35+(i.sink||0)/.03,.35,1)),h}var sd=new Map;function cd(e){if(!sd.has(e)){let t=new Uint32Array((e-1)*(e-1)*6),n=0;for(let r=0;r<e-1;r++)for(let i=0;i<e-1;i++){let a=r*e+i,o=a+e,s=a+1,c=o+1;t[n++]=a,t[n++]=o,t[n++]=s,t[n++]=o,t[n++]=c,t[n++]=s}sd.set(e,new Pn(t,1))}return sd.get(e)}var ld=e=>{let t=1;for(;t*2<=e;)t*=2;return t},ud=1.6;function dd(e,t=4){let n=uu(e),r=n.M,i=Math.min(2048,r-1),a=(r-1)/i,o=new Uint8Array(i*i*2),s=n.h,c=1/(2*n.dx*a),l=e=>Math.max(0,Math.min(255,Math.round((e/ud*.5+.5)*255)));for(let e=0;e<i;e++){let t=Math.floor(e*a),n=Math.min(r-1,Math.floor((e+1)*a)),u=t*r,d=n*r;for(let t=0;t<i;t++){let n=Math.floor(t*a),f=Math.min(r-1,Math.floor((t+1)*a)),p=s[u+n],m=s[u+f],h=s[d+n],g=s[d+f],_=(e*i+t)*2;o[_]=l((m-p+g-h)*c),o[_+1]=l((h-p+g-m)*c)}}let u=new es(o,i,i,O,b);return u.minFilter=y,u.magFilter=_,u.generateMipmaps=!0,u.anisotropy=t,u.needsUpdate=!0,u}var fd=class{constructor(e,t,n,r,i={}){let a=uu(t),o=a.M,s=o-1;Object.assign(this,{scene:e,patch:t,U:a,M:o,mat:n,half:t.size/2,ex:1,k:i.k||.03,C:s>=2048?128:64,pending:0,tris:0,builds:0,lru:[]}),this.T=s/this.C,this.maxS=Math.max(1,this.C/4),this.border=Math.max(1,s/(t.C?16:32)),this.group=new Ao,e.add(this.group),this.tiles=[];for(let e=0;e<this.T;e++)for(let t=0;t<this.T;t++){let r=new lr(new Gn,n);r.castShadow=!0,r.receiveShadow=!0,r.visible=!1,this.group.add(r);let i=e*this.C,s=t*this.C,c=1/0,l=-1/0;for(let e=0;e<=this.C;e+=Math.max(1,this.C/8))for(let t=0;t<=this.C;t+=Math.max(1,this.C/8)){let n=a.h[(i+e)*o+s+t];n<c&&(c=n),n>l&&(l=n)}this.tiles.push({ti:e,tj:t,i0:i,j0:s,x0:s*a.dx-this.half,z0:i*a.dx-this.half,w:this.C*a.dx,lo:c,hi:l,mesh:r,geos:new Map,cur:0,want:0,d:0,edge:``})}if(this.ctx=[],t.C){let e=new lr(this.ringGeometry(t.C),r);e.receiveShadow=!0,this.group.add(e),this.ctx.push(e)}else{let e=this.tileGeometry({i0:0,j0:0,x0:-this.half,z0:-this.half},this.border,s);for(let r=-2;r<=2;r++)for(let i=-2;i<=2;i++){if(!r&&!i)continue;let a=new lr(e,n);a.receiveShadow=!0,a.userData.ring=Math.max(Math.abs(r),Math.abs(i)),a.position.set(r*t.size,0,i*t.size),a.scale.set(Math.abs(r)%2?-1:1,1,Math.abs(i)%2?-1:1),this.group.add(a),this.ctx.push(a)}this.outerGeo=e}this.nP=Math.max(16,Math.min(64,Math.round(64/a.dx/8)*8)),this.dpMesh=new lr(new Gn,n),this.dpMesh.castShadow=!0,this.dpMesh.receiveShadow=!0,this.dpMesh.visible=!1,this.group.add(this.dpMesh),this.farMesh=new lr(new Gn,n),this.farMesh.receiveShadow=!0,this.farMesh.visible=!1,this.group.add(this.farMesh),this.farKey=``,this.rocks=i.rock?new pd(this,i.rock):null}placePatch(e){let t=this.nP,n=this.M-1,r=Math.round((e[1]+this.half)/this.U.dx),i=Math.round((e[0]+this.half)/this.U.dx),a=this.dp;if(a&&Math.abs(r-(a.i0+t/2))<=t/4&&Math.abs(i-(a.j0+t/2))<=t/4)return!1;let o=e=>Math.max(0,Math.min(n-t,Math.round((e-t/2)/8)*8));return this.dp={i0:o(r),j0:o(i),n:t},!0}overlaps(e){let t=this.dp;return!!t&&!(e.i0+this.C<=t.i0||e.i0>=t.i0+t.n||e.j0+this.C<=t.j0||e.j0>=t.j0+t.n)}curAt(e,t){let n=this.tileAt(Math.floor(e/this.C),Math.floor(t/this.C));return n?n.cur||this.maxS:this.border}buildPatch(e){let t=this.dp,n=t.n,r=n+1,{U:i,M:a}=this,o=i.h,s=i.dx;if(e){let e=new Float32Array(r*r*3),i=new Float32Array(r*r*3);for(let n=0;n<r;n++)for(let c=0;c<r;c++){let l=t.i0+n,u=t.j0+c,d=(n*r+c)*3,f=Math.max(0,l-1),p=Math.min(a-1,l+1),m=Math.max(0,u-1),h=Math.min(a-1,u+1),g=(o[l*a+h]-o[l*a+m])/((h-m)*s),_=(o[p*a+u]-o[f*a+u])/((p-f)*s),v=1/Math.hypot(g,1,_);e[d]=u*s-this.half,e[d+1]=o[l*a+u],e[d+2]=l*s-this.half,i[d]=-g*v,i[d+1]=v,i[d+2]=-_*v}let c=new Gn;c.setAttribute(`position`,new Pn(e,3)),c.setAttribute(`normal`,new Pn(i,3)),c.setIndex(cd(r)),c.userData={s:1,m:r,tris:n*n*2,detail:!0},c.computeBoundingSphere(),this.dpMesh.geometry.dispose(),this.dpMesh.geometry=c,this.dpMesh.visible=!0}let c=this.dpMesh.geometry.attributes.position.array;for(let e=0;e<4;e++){let i=e<2,s=e===0||e===2?0:n;for(let e=0;e<=n;e++){let l=i?t.i0+s:t.i0+e,u=i?t.j0+e:t.j0+s,d=i?s?l:l-1:l,f=i||s?u:u-1,p=i&&s?l-1:l,m=i?u:s?u-1:u,h=Math.max(this.curAt(Math.max(0,d),Math.max(0,f)),this.curAt(Math.max(0,p),Math.max(0,m))),g=i?u:l,_=o[l*a+u];if(h>1&&g%h){let e=g-g%h,t=Math.min(a-1,e+h),n=(g-e)/h,r=i?o[l*a+e]:o[e*a+u];_=r+((i?o[l*a+t]:o[t*a+u])-r)*n}c[(i?(s?n:0)*r+e:e*r+(s?n:0))*3+1]=_}}this.dpMesh.geometry.attributes.position.needsUpdate=!0}holeIndex(e,t,n){let r=this.dp,i=[];for(let a=0;a<n-1;a++)for(let o=0;o<n-1;o++){let s=e.i0+a*t,c=e.j0+o*t;if(s>=r.i0&&s+t<=r.i0+r.n&&c>=r.j0&&c+t<=r.j0+r.n)continue;let l=a*n+o,u=l+n,d=l+1,f=u+1;i.push(l,u,d,u,f,d)}return new In(i,1)}setExag(e){this.ex=e,this.group.scale.y=e,this.rocks&&this.rocks.update(null,null,!0)}tileGeometry(e,t,n=this.C){let{U:r,M:i}=this,a=n/t+1,o=new Float32Array(a*a*3),s=new Float32Array(a*a*3),c=r.h,l=r.dx;for(let n=0;n<a;n++){let r=e.i0+n*t,u=Math.max(0,r-t),d=Math.min(i-1,r+t);for(let f=0;f<a;f++){let p=e.j0+f*t,m=(n*a+f)*3,h=Math.max(0,p-t),g=Math.min(i-1,p+t),_=(c[r*i+g]-c[r*i+h])/((g-h)*l),v=(c[d*i+p]-c[u*i+p])/((d-u)*l),y=1/Math.hypot(_,1,v);o[m]=p*l-this.half,o[m+1]=c[r*i+p],o[m+2]=r*l-this.half,s[m]=-_*y,s[m+1]=y,s[m+2]=-v*y}}let u=new Gn;return u.setAttribute(`position`,new Pn(o,3)),u.setAttribute(`normal`,new Pn(s,3)),u.setIndex(cd(a)),u.userData={s:t,m:a,tris:(a-1)*(a-1)*2},u.computeBoundingSphere(),this.builds++,u}ringGeometry(e){let t=(e.n-1)/2+1,n=new Float32Array(t*t);for(let r=0;r<t;r++)for(let i=0;i<t;i++)n[r*t+i]=e.h[r*2*e.n+i*2];let r={n:t,h:n,dx:e.dx*2,size:e.size},i=r.n,a=new Float32Array(i*i*3),o=new Float32Array(i*i*3),s=new Float32Array(i*i*2),c=r.h,l=r.size/2;for(let e=0;e<i;e++)for(let t=0;t<i;t++){let n=(e*i+t)*3,u=Math.max(0,t-1),d=Math.min(i-1,t+1),f=Math.max(0,e-1),p=Math.min(i-1,e+1),m=(c[e*i+d]-c[e*i+u])/((d-u)*r.dx),h=(c[p*i+t]-c[f*i+t])/((p-f)*r.dx),g=1/Math.hypot(m,1,h);a[n]=t*r.dx-l,a[n+1]=c[e*i+t],a[n+2]=e*r.dx-l,o[n]=-m*g,o[n+1]=g,o[n+2]=-h*g,s[(e*i+t)*2]=t/(i-1),s[(e*i+t)*2+1]=e/(i-1)}let u=Math.round((r.size/2-this.half)/r.dx),d=Math.round((r.size/2+this.half)/r.dx),f=[];for(let e=0;e<i-1;e++)for(let t=0;t<i-1;t++){if(e>=u&&e<d&&t>=u&&t<d)continue;let n=e*i+t,r=n+i,a=n+1,o=r+1;f.push(n,r,a,r,o,a)}let p=new Gn;return p.setAttribute(`position`,new Pn(a,3)),p.setAttribute(`normal`,new Pn(o,3)),p.setAttribute(`uv`,new Pn(s,2)),p.setIndex(f),p.computeBoundingSphere(),p}tileAt(e,t){return e<0||t<0||e>=this.T||t>=this.T?null:this.tiles[e*this.T+t]}stitch(e){let t=e.mesh.geometry,n=t.userData;if(!n||!n.m)return;let r=[this.tileAt(e.ti-1,e.tj),this.tileAt(e.ti+1,e.tj),this.tileAt(e.ti,e.tj-1),this.tileAt(e.ti,e.tj+1)].map(e=>e?e.cur||this.maxS:this.border),i=r.join(`,`);if(n.edge===i)return;n.edge=i;let{s:a,m:o}=n,s=t.attributes.position.array,c=this.U.h,l=this.M,u=this.C;for(let t=0;t<4;t++){let n=r[t],i=t<2,d=t===0||t===2?0:u;for(let t=0;t<o;t++){let r=t*a,u=i?d/a*o+t:t*o+d/a,f=i?e.i0+d:e.i0+r,p=i?e.j0+r:e.j0+d,m=c[f*l+p];if(n>a&&r%n){let t=r-r%n,a=t+n,o=(r-t)/n,s=i?c[f*l+e.j0+t]:c[(e.i0+t)*l+p];m=s+((i?c[f*l+e.j0+a]:c[(e.i0+a)*l+p])-s)*o}s[u*3+1]=m}}t.attributes.position.needsUpdate=!0}update(e,t,n){let{tiles:r,U:i,ex:a}=this,o=t?1/0:4,s=performance.now(),c=new Set,l=[],u=n&&n[0]?this.placePatch(n[0]):!1,d=!!this.dp;for(let t of r){let n=Math.max(t.x0-e.x,0,e.x-t.x0-t.w),r=Math.max(t.z0-e.z,0,e.z-t.z0-t.w),o=Math.max(t.lo*a-e.y,0,e.y-t.hi*a),s=Math.hypot(n,o,r);t.d=s,t.mesh.castShadow=!d&&s<40;let c=e=>Math.max(1,Math.min(this.maxS,ld(Math.max(1,e*this.k/i.dx)))),u=c(s);t.cur&&t.cur!==u&&t.cur>=c(s*.85)&&t.cur<=c(s*1.18)&&(u=t.cur),t.pin=d&&this.overlaps(t),d&&(u=Math.max(2,u)),t.pin&&(u=Math.min(8,u)),t.want=u,u!==t.cur&&l.push(t)}l.sort((e,t)=>e.d-t.d);let f=0;for(let e of l){let t=e.geos.get(e.want);if(!t){if(performance.now()-s>o&&e.cur&&!e.pin){f++;continue}t=this.tileGeometry(e,e.want),e.geos.set(e.want,t)}e.mesh.geometry=t,e.mesh.visible=!0,e.cur=e.want,t.userData.edge=``,c.add(e);for(let t of[this.tileAt(e.ti-1,e.tj),this.tileAt(e.ti+1,e.tj),this.tileAt(e.ti,e.tj-1),this.tileAt(e.ti,e.tj+1)])t&&c.add(t);if(e.want<=2){let t=e;this.lru=this.lru.filter(e=>e!==t),this.lru.push(t)}}for(let e of c)e.cur&&this.stitch(e);if(d){for(let e of r){if(!e.cur)continue;let t=e.mesh.geometry,n=e.pin?`${t.userData.s}|${this.dp.i0},${this.dp.j0}`:``;(t.userData.hole||``)!==n&&(t.userData.holeIdx&&(t.userData.holeIdx=null),t.setIndex(n?t.userData.holeIdx=this.holeIndex(e,t.userData.s,t.userData.m):cd(t.userData.m)),t.userData.hole=n)}(u||c.size)&&this.buildPatch(u)}let p=Math.max(2,this.maxS/2),m=r.filter(e=>e.cur>=p&&!e.pin),h=m.map(e=>e.ti*this.T+e.tj+`:`+e.cur+`:`+e.mesh.geometry.userData.edge).join(`,`);if(h!==this.farKey){this.farKey=h;let e=0,t=0;for(let n of m)e+=n.mesh.geometry.attributes.position.count,t+=n.mesh.geometry.index.count;let n=new Float32Array(e*3),r=new Float32Array(e*3),i=new Uint32Array(t),a=0,o=0;for(let e of m){let t=e.mesh.geometry,s=t.attributes.position.array,c=t.attributes.normal.array,l=t.index.array;n.set(s,a*3),r.set(c,a*3);for(let e=0;e<l.length;e++)i[o+e]=l[e]+a;a+=s.length/3,o+=l.length}let s=new Gn;s.setAttribute(`position`,new Pn(n,3)),s.setAttribute(`normal`,new Pn(r,3)),s.setIndex(new Pn(i,1)),s.computeBoundingSphere(),this.farMesh.geometry.dispose(),this.farMesh.geometry=s,this.farMesh.visible=m.length>0}for(let e of r)e.cur&&(e.mesh.visible=!(e.cur>=p&&!e.pin));if(this.lru.length>40){let e=[],t=this.lru.length-40;for(let n of this.lru)if(t>0&&n.cur>2){for(let[e,t]of n.geos)e<=2&&(t.dispose(),n.geos.delete(e));t--}else e.push(n);this.lru=e}if(c.size||u){let e=0;for(let t of r)e+=t.mesh.geometry.userData.tris||0;this.tris=e+(this.dp?this.nP*this.nP*2:0)}return this.pending=f,f}dispose(){for(let e of this.tiles)for(let t of e.geos.values())t.dispose();this.dpMesh.geometry.dispose(),this.farMesh.geometry.dispose(),this.ctx.forEach(e=>e.geometry.dispose()),this.rocks&&this.rocks.dispose(),this.scene.remove(this.group)}},pd=class{constructor(e,t){this.g=e,this.o=t,this.N=700,this.cell=6,this.R=60,this.c=null;let n=new Fs(1,1),r=n.attributes.position,i=ru(77),a=new Map;for(let e=0;e<r.count;e++){let t=`${r.getX(e).toFixed(3)},${r.getY(e).toFixed(3)},${r.getZ(e).toFixed(3)}`;a.has(t)||a.set(t,.72+i()*.5);let n=a.get(t);r.setXYZ(e,r.getX(e)*n,r.getY(e)*n*.7,r.getZ(e)*n)}n.computeVertexNormals(),this.mat=new Rs({color:t.color,roughness:.95,metalness:0,flatShading:!0}),this.mesh=new fs(n,this.mat,this.N),this.mesh.castShadow=!1,this.mesh.receiveShadow=!0,this.mesh.frustumCulled=!1,this.mesh.count=0,e.scene.add(this.mesh),this.seed=nu(e.patch.id+`|rocks`),this._m=new U,this._q=new ut,this._e=new Yt,this._s=new H,this._p=new H}update(e,t,n){if(e==null){if(!this.c)return;e=this.c[0],t=this.c[1]}if(!n&&this.c&&Math.hypot(e-this.c[0],t-this.c[1])<this.cell*2)return;this.c=[e,t];let{g:r,cell:i,R:a,o}=this,s=r.U,c=r.half,l=Math.floor((e-a)/i),u=Math.floor((e+a)/i),d=Math.floor((t-a)/i),f=Math.floor((t+a)/i),p=0;for(let n=d;n<=f&&p<this.N;n++)for(let d=l;d<=u&&p<this.N;d++){let l=ru((this.seed^Math.imul(d+32768,73856093)^Math.imul(n+32768,19349663))>>>0),u=l()<o.abundance?1+ +(l()<o.abundance*.5):0;for(let o=0;o<u&&p<this.N;o++){let o=(d+l())*i,u=(n+l())*i;if(Math.abs(o)>c-1||Math.abs(u)>c-1||Math.hypot(o-e,u-t)>a){l(),l(),l();continue}let f=Math.min(.9,.11*(1-l()*.985)**-.6),m=du(s.h,s.M,s.dx,o+c,u+c)*r.ex;this._e.set(l()*.5,l()*6.283,l()*.5),this._q.setFromEuler(this._e),this._s.set(f,f,f),this._p.set(o,m+f*.18,u),this.mesh.setMatrixAt(p++,this._m.compose(this._p,this._q,this._s))}}this.mesh.count=p,this.mesh.instanceMatrix.needsUpdate=!0}dispose(){this.g.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.mat.dispose(),this.mesh.dispose&&this.mesh.dispose()}},md=class e{constructor(t,n=900){this.scene=t,this.N=n,this.n=0,this.last=null,this.rib=[0,1].map(()=>{let r=new Gn,i=new Float32Array(n*6),a=new Float32Array(n*6).fill(1),o=new Uint32Array((n-1)*6);for(let e=0;e<n-1;e++){let t=e*2;o.set([t,t+1,t+2,t+1,t+3,t+2],e*6)}r.setAttribute(`position`,new Pn(i,3)),r.setAttribute(`color`,new Pn(a,3)),r.setIndex(new Pn(o,1)),r.setDrawRange(0,0);let s=new lr(r,e.mat||=new jn({vertexColors:!0,blending:4,transparent:!0,depthWrite:!1,fog:!1,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3,side:2,toneMapped:!1}));return s.frustumCulled=!1,s.renderOrder=3,t.add(s),{g:r,pos:i,col:a,m:s,str:new Float32Array(n)}})}reset(){this.n=0,this.last=null,this.rib.forEach(e=>e.g.setDrawRange(0,0))}add(e,t,n,r){let i=e[0];if(this.last){let e=Math.hypot(i[0]-this.last[0],i[2]-this.last[2]);if(e<.3)return;e>6&&this.reset()}if(this.last=[i[0],i[1],i[2]],this.n>=this.N){let e=this.N>>3;this.rib.forEach(t=>{t.pos.copyWithin(0,e*6),t.str.copyWithin(0,e)}),this.n-=e}let a=this.n++,o=-t[1]*n/2,s=t[0]*n/2;this.rib.forEach((t,n)=>{let i=e[n];t.pos.set([i[0]-o,i[1],i[2]-s,i[0]+o,i[1],i[2]+s],a*6),t.str[a]=r;for(let e=0;e<this.n;e++){let n=(this.n-1-e)/this.N,r=1-.42*t.str[e]*Math.sqrt(Math.max(0,1-n)),i=e*6;t.col[i]=t.col[i+1]=t.col[i+2]=t.col[i+3]=t.col[i+4]=t.col[i+5]=r}t.g.attributes.position.needsUpdate=!0,t.g.attributes.color.needsUpdate=!0,t.g.setDrawRange(0,Math.max(0,(this.n-1)*6))})}dispose(){this.rib.forEach(e=>{this.scene.remove(e.m),e.g.dispose()})}},hd=[{name:`High`,dpr:1.5,shadow:2048,shadowDrive:1024,ext:1,insetScale:.5,insetEvery:1,lod:.03,ring:2,simple:0,nrm:1,tiny:1,dust:1,insetShadowEvery:3},{name:`High, 1x pixels`,dpr:1,shadow:2048,shadowDrive:1024,ext:1,insetScale:.5,insetEvery:1,lod:.03,ring:2,simple:0,nrm:1,tiny:1,dust:1,insetShadowEvery:3},{name:`Medium`,dpr:1,shadow:1024,shadowDrive:1024,ext:.7,insetScale:.5,insetEvery:1,lod:.04,ring:2,simple:0,nrm:1,tiny:1,dust:.6,insetShadowEvery:6},{name:`Medium, lighter`,dpr:1,shadow:1024,shadowDrive:512,ext:.6,insetScale:.5,insetEvery:2,lod:.05,ring:1,simple:0,nrm:1,tiny:1,dust:.4,insetShadowEvery:0},{name:`Low`,dpr:.75,shadow:512,shadowDrive:512,ext:.5,insetScale:.4,insetEvery:`move`,lod:.06,ring:1,simple:1,nrm:0,tiny:0,dust:.25,insetShadowEvery:0},{name:`Lowest`,dpr:.75,shadow:512,shadowDrive:512,ext:.4,insetScale:.33,insetEvery:`move`,lod:.09,ring:0,simple:1,nrm:0,tiny:0,dust:0,insetShadowEvery:0}],gd={high:0,medium:2,low:4},_d=`terra.quality`,vd=`terra.quality.autoStep`,yd={get(e){try{return localStorage.getItem(e)}catch{return null}},set(e,t){try{localStorage.setItem(e,t)}catch{}}},bd=new URLSearchParams(location.search),xd=class{constructor(e=0,t=hd.length-1){Object.assign(this,{step:e,max:t,win:[],lastChange:-1e9,goodSince:null,block:new Map,fails:new Map})}feed(e,t,n){if(!(t>0))return-1;t=Math.min(t,5e3),this.win.push([e,t,n==null?t:Math.max(n,0)]);let r=0,i=0;for(let e of this.win)r+=e[1],i+=e[2];for(;this.win.length>3&&r-this.win[0][1]>=1e3;)r-=this.win[0][1],i-=this.win[0][2],this.win.shift();if(this.win.length<3||r<900||e-this.lastChange<2500)return-1;let a=r/this.win.length,o=i/this.win.length;if(a>20&&this.step<this.max){let t=(this.fails.get(this.step)||0)+1;return this.fails.set(this.step,t),e-(this.upAt||-1e9)<8e3&&this.block.set(this.step,e+3e4*2**(t-1)),this.change(e,this.step+1)}return o<12?this.goodSince??=e:this.goodSince=null,this.goodSince!=null&&e-this.goodSince>5e3&&this.step>0&&!((this.block.get(this.step-1)||0)>e)?(this.upAt=e,this.change(e,this.step-1)):-1}change(e,t){return this.step=t,this.lastChange=e,this.win.length=0,this.goodSince=null,t}},J={mode:(bd.get(`q`)||yd.get(_d)||`auto`).toLowerCase(),step:0,gov:null,apply:null,info:null,gpu:null,overlay:!1,el:null,notice:null,ntimer:0,frames:[],js:[],gpuMs:[],last:0,statT:0,calls:0,tris:0,bench:null};!(J.mode in gd)&&J.mode!==`auto`&&(J.mode=`auto`),J.step=J.mode===`auto`?Math.min(hd.length-1,Math.max(0,+(yd.get(vd)||0))):gd[J.mode],J.gov=new xd(J.step);var Sd=()=>hd[J.step],Cd=()=>{let e=Sd();return{...e,name:`${e.name}, VR`,shadow:Math.min(e.shadow,1024),ext:Math.min(e.ext,.5),insetEvery:0,insetShadowEvery:0,dust:Math.min(e.dust,.4)}};window.TERRA_QUALITY={state:()=>({mode:J.mode,step:J.step,name:hd[J.step].name,aa:J.aa,gpuTimer:!!J.gpu}),set:e=>Ed(e),levels:hd,gov:()=>J.gov};function wd(){return J.aa=!(J.step>=gd.low)&&!bd.has(`noaa`),J.aa}function Td(e,t){J.apply=t,J.info=e.info,e.info.autoReset=!1;let n=e.getContext(),r=n.getExtension&&n.getExtension(`EXT_disjoint_timer_query_webgl2`);r&&n.createQuery&&(J.gpu={gl:n,ext:r,pending:[],q:null});try{let e=n.getExtension(`WEBGL_debug_renderer_info`);J.gpuName=e?n.getParameter(e.UNMASKED_RENDERER_WEBGL):n.getParameter(n.RENDERER)}catch{J.gpuName=`unknown`}t(Sd())}function Ed(e){if(e=String(e).toLowerCase(),!(e in gd)&&e!==`auto`)return;J.mode=e,yd.set(_d,e);let t=e===`auto`?J.gov.step:gd[e];e===`auto`?J.gov=new xd(J.step):J.gov.step=t,Dd(t,null),Nd()}function Dd(e,t){if(e===J.step)return;let n=e>J.step;J.step=e,J.mode===`auto`&&yd.set(vd,String(e)),J.apply&&J.apply(Sd()),t&&Od(`Quality ${n?`lowered`:`raised`} to ${Sd().name} ${n?`to keep speed`:`(frames have time to spare)`}`),J.bench&&J.bench.changes.push(`${((performance.now()-J.bench.t0)/1e3).toFixed(1)} s: ${Sd().name}`)}function Od(e){J.notice||(J.notice=document.createElement(`div`),J.notice.className=`q-notice`,document.body.appendChild(J.notice)),J.notice.textContent=e,J.notice.classList.add(`on`),clearTimeout(J.ntimer),J.ntimer=setTimeout(()=>J.notice.classList.remove(`on`),3500)}function kd(){J.info&&J.info.reset();let e=J.gpu;return e&&!e.q&&!J.noGpu&&(e.q=e.gl.createQuery(),e.gl.beginQuery(e.ext.TIME_ELAPSED_EXT,e.q)),performance.now()}function Ad(e,t,n){let r=performance.now()-t,i=J.gpu;i&&i.q&&(i.gl.endQuery(i.ext.TIME_ELAPSED_EXT),n?i.pending.push(i.q):i.gl.deleteQuery(i.q),i.q=null);let a=null;if(i){let e=i.gl.getParameter(i.ext.GPU_DISJOINT_EXT);for(;i.pending.length&&i.gl.getQueryParameter(i.pending[0],i.gl.QUERY_RESULT_AVAILABLE);){let t=i.pending.shift();e||(a=i.gl.getQueryParameter(t,i.gl.QUERY_RESULT)/1e6),i.gl.deleteQuery(t)}i.pending.length>8&&(i.pending.forEach(e=>i.gl.deleteQuery(e)),i.pending.length=0),a!=null&&(J.lastGpu=a)}if(!n){J.last=0;return}let o=J.last?e-J.last:0;J.last=e,J.info&&(J.calls=J.info.render.calls,J.tris=J.info.render.triangles),o&&(J.frames.push([e,o]),J.js.push([e,r]),J.lastGpu!=null&&J.gpuMs.push([e,J.lastGpu]));let s=e-2e3;for(let e of[J.frames,J.js,J.gpuMs])for(;e.length&&e[0][0]<s;)e.shift();if(J.bench&&J.bench.sample(o,r,J.calls,J.tris),J.mode===`auto`&&o){let t=J.gov.feed(e,o,J.gpu&&J.lastGpu!=null?Math.max(r,J.lastGpu):null);t>=0&&Dd(t,`auto`)}J.overlay&&e-J.statT>250&&(J.statT=e,jd())}document.addEventListener(`visibilitychange`,()=>{J.last=0,J.gov&&(J.gov.win.length=0,J.gov.goodSince=null)}),document.addEventListener(`keydown`,e=>{e.code!==`F3`||e.repeat||(e.preventDefault(),J.overlay=!J.overlay,J.el||(J.el=document.createElement(`pre`),J.el.className=`fps-overlay`,document.body.appendChild(J.el)),J.el.classList.toggle(`hidden`,!J.overlay),jd(),window.TERRA_SITE&&TERRA_SITE.wake&&TERRA_SITE.wake(2e3))});function jd(){if(!J.el)return;let e=J.frames.map(e=>e[1]),t=e.length?e.reduce((e,t)=>e+t,0)/e.length:0,n=e.length?Math.max(...e):0,r=J.js.length?J.js.reduce((e,t)=>e+t[1],0)/J.js.length:0,i=J.gpuMs.length?J.gpuMs.reduce((e,t)=>e+t[1],0)/J.gpuMs.length:null,a=Sd(),o=window.TERRA_SITE,s=o&&o.drive;J.el.textContent=e.length?[`${(1e3/t).toFixed(0)} fps   frame ${t.toFixed(1)} ms (worst ${n.toFixed(0)} ms, last 2 s)`,`JS ${r.toFixed(1)} ms/frame   GPU ${i==null?`n/a`:i.toFixed(1)+` ms/frame`}`,`draw calls ${J.calls}   triangles ${J.tris.toLocaleString()}`,`quality ${a.name} (${J.mode===`auto`?`auto`:`forced`})   pixel ratio ${(o&&o.renderer?o.renderer.getPixelRatio():0).toFixed(2)}   shadow ${s?a.shadowDrive:a.shadow}   AA ${J.aa?`on`:`off`}`].join(`
`):`idle: no frames drawn (render on demand)\nquality ${a.name} (${J.mode})   F3 hides this`}function Md(e){if(!e)return;let t=e.querySelector(`.gfx-q`);t||(t=document.createElement(`div`),t.className=`gfx-q`,e.appendChild(t)),t.innerHTML=`<h4>Graphics quality</h4><div class="seg" role="group" aria-label="Graphics quality">${[`auto`,`high`,`medium`,`low`].map(e=>`<button type="button" data-q="${e}">${e[0].toUpperCase()+e.slice(1)}</button>`).join(``)}</div><p class="hint" data-qnote></p>`,t.querySelectorAll(`button`).forEach(e=>{e.onclick=t=>{t.stopPropagation(),Ed(e.dataset.q)}}),J.ctrl=t,Nd()}function Nd(){J.ctrl&&(J.ctrl.querySelectorAll(`button`).forEach(e=>e.classList.toggle(`active`,e.dataset.q===J.mode)),J.ctrl.querySelector(`[data-qnote]`).textContent=`Now: ${Sd().name}. Auto lowers quality when frames take longer than 20 ms and raises it slowly when they are fast. Press F3 in Site View for the frame-time overlay. Antialiasing is chosen when Site View first opens (off after Low).`)}var Pd=()=>bd.has(`bench`)?bd.get(`bench`)===`site`?`site`:`drive`:null;function Fd(e,t=20,n=2){let r=J.bench={kind:e,t0:performance.now(),iv:[],js:[],calls:[],tris:[],changes:[`0.0 s: ${Sd().name}`],warm:n,seconds:t,done:null};return r.sample=(e,t,i,a)=>{(performance.now()-r.t0)/1e3<n||!e||(r.iv.push(e),r.js.push(t),r.calls.push(i),r.tris.push(a))},new Promise(e=>{r.done=e,setTimeout(()=>e(Id()),(t+n)*1e3)})}function Id(){let e=J.bench;if(!e)return null;J.bench=null;let t=e.iv.slice().sort((e,t)=>e-t),n=t.length,r=e=>n?t[Math.min(n-1,Math.floor(e*n))]:0,i=e=>e.length?e.reduce((e,t)=>e+t,0)/e.length:0,a=t.slice(Math.floor(n*.99)),o=window.TERRA_SITE,s={kind:e.kind,seconds:e.seconds,frames:n,avgFps:n?+(1e3/i(t)).toFixed(1):0,low1Fps:a.length?+(1e3/i(a)).toFixed(1):0,frameMs:{p50:+r(.5).toFixed(1),p90:+r(.9).toFixed(1),p95:+r(.95).toFixed(1),p99:+r(.99).toFixed(1),max:+(t[n-1]||0).toFixed(1)},jsMs:+i(e.js).toFixed(2),drawCalls:Math.round(i(e.calls)),triangles:Math.round(i(e.tris)),qualityEnd:Sd().name,mode:J.mode,changes:e.changes,pixelRatio:o&&o.renderer?o.renderer.getPixelRatio():null,devicePixelRatio:window.devicePixelRatio,viewport:`${innerWidth}x${innerHeight}`,aa:J.aa,gpuTimer:!!J.gpu,gpu:J.gpuName,ua:navigator.userAgent},c=`TerraAnalog benchmark (${s.kind===`site`?`Site View orbit`:`drive mode`}, ${s.seconds} s)\naverage ${s.avgFps} fps, 1% low ${s.low1Fps} fps, ${s.frames} frames\nframe time p50 ${s.frameMs.p50} ms, p90 ${s.frameMs.p90}, p95 ${s.frameMs.p95}, p99 ${s.frameMs.p99}, worst ${s.frameMs.max}\nJS ${s.jsMs} ms/frame, draw calls ${s.drawCalls}/frame, triangles ${s.triangles.toLocaleString()}/frame\nquality at the end: ${s.qualityEnd} (${s.mode}); changes: ${s.changes.join(` | `)}\npixel ratio ${s.pixelRatio} (device ${s.devicePixelRatio}), viewport ${s.viewport}, antialias ${s.aa?`on`:`off`}, GPU timer ${s.gpuTimer?`yes`:`no`}\nGPU: ${s.gpu}\n${s.ua}`;console.log(`TERRA_BENCH
`+c),console.log(`TERRA_BENCH_JSON `+JSON.stringify(s)),window.TERRA_BENCH_RESULT=s;let l=document.createElement(`div`);return l.className=`bench-panel`,l.innerHTML=`<b>Benchmark finished</b><p>Copy this and send it:</p><textarea readonly rows="9"></textarea><div><button type="button" data-copy>Copy</button> <button type="button" data-close>Close</button></div>`,l.querySelector(`textarea`).value=c,l.querySelector(`[data-copy]`).onclick=()=>{l.querySelector(`textarea`).select();try{navigator.clipboard.writeText(c)}catch{document.execCommand(`copy`)}},l.querySelector(`[data-close]`).onclick=()=>l.remove(),document.body.appendChild(l),s}var Ld={scale:1},Rd=e=>e<.5?4*e*e*e:1-(-2*e+2)**3/2,zd={gravity_mps2:{moon:1.62,mars:3.71,earth:9.81},sources:{fallback:{label:`Built-in fallback figure, no source`,url:null,note:`Used only because the rover registry could not be loaded. Not a published figure.`}},limits:{mars:{mass_kg:[300,1500],wheel_radius_m:[.15,.4],wheel_width_m:[.1,.6],wheel_count:[4,6],motor_power_w:[50,400],battery_wh:[100,6e3],top_speed_ms:[.02,.15]},moon:{mass_kg:[100,1e3],wheel_radius_m:[.12,.45],wheel_width_m:[.08,.5],wheel_count:[4,6],motor_power_w:[50,500],battery_wh:[100,3e3],top_speed_ms:[.05,.5]},test:{mass_kg:[150,1e3],wheel_radius_m:[.15,.4],wheel_width_m:[.1,.6],wheel_count:[4,6],motor_power_w:[30,400],battery_wh:[100,3e3],top_speed_ms:[.02,.15]}},soils:{_note:`Simplified Bekker constants per ground class. ASSUMED and simplified: order-of-magnitude values in the range of published terramechanics tables, not measurements of any site. p = (kc/b + kphi) * z^n with p in kPa, b the wheel width in m, z the sinkage in m; kc in kN/m^(n+1), kphi in kN/m^(n+2).`,fine_regolith:{label:`Fine regolith`,n:1,kc:1.4,kphi:820,source_id:`assumed`},sand:{label:`Sand`,n:1.1,kc:1,kphi:1530,source_id:`assumed`},rocky:{label:`Rocky, firm ground`,n:.8,kc:30,kphi:9e3,source_id:`assumed`}},defaults_by_body:{mars:`fallback`,moon:`fallback`},rovers:[{id:`fallback`,display_name:`Simple fallback rover`,mission:`Built-in stand-in, used only when the rover registry or model could not be loaded`,planet:`test`,badge:`generic`,model_file:null,model_scale:1,wheel_node_names:[`wheel_01_L`,`wheel_01_R`,`wheel_03_L`,`wheel_03_R`],geometry:{model_length_m:2.05,model_width_m:1.6,model_height_m:1.645,wheelbase_m:1.5,track_m:1.4,wheel_radius_model_m:.275,wheel_width_model_m:.2,hub_height_m:.275,hubs:[{name:`wheel_01_L`,u:.75,v:.7},{name:`wheel_01_R`,u:.75,v:-.7},{name:`wheel_03_L`,u:-.75,v:.7},{name:`wheel_03_R`,u:-.75,v:-.7}]},fig:{mass_kg:{value:430,unit:`kg`,source_id:`fallback`,verified:!1},wheel_count:{value:4,unit:``,source_id:`fallback`,verified:!1},wheel_radius_m:{value:.25,unit:`m`,source_id:`fallback`,verified:!1},wheel_width_m:{value:.2,unit:`m`,source_id:`fallback`,verified:!1},top_speed_ms:{value:.2,unit:`m/s`,source_id:`fallback`,verified:!1},motor_power_w:{value:200,unit:`W`,source_id:`fallback`,verified:!1},battery_wh:{value:300,unit:`Wh`,source_id:`fallback`,verified:!1,note:`illustrative drive energy budget`},base_power_w:{value:80,unit:`W`,source_id:`fallback`,verified:!1},ground_clearance_m:{value:.45,unit:`m`,source_id:`fallback`,verified:!1},max_slope_deg:{value:25,unit:`deg`,source_id:`fallback`,verified:!1},drive_force_max_N:{value:700,unit:`N`,source_id:`fallback`,verified:!1,note:`about the rover weight on the Moon`},drive_efficiency:{value:.45,unit:``,source_id:`fallback`,verified:!1}}}]},Bd=[`mass_kg`,`wheel_count`,`wheel_radius_m`,`wheel_width_m`,`top_speed_ms`,`motor_power_w`,`battery_wh`,`base_power_w`,`ground_clearance_m`,`max_slope_deg`],Vd=[`mass_kg`,`wheel_count`,`wheel_radius_m`,`wheel_width_m`,`motor_power_w`,`battery_wh`,`top_speed_ms`],Hd={mass_kg:`Mass`,wheel_count:`Wheel count`,wheel_radius_m:`Wheel radius`,wheel_width_m:`Wheel width`,top_speed_ms:`Top speed`,motor_power_w:`Motor power`,battery_wh:`Battery`,base_power_w:`Base power`,ground_clearance_m:`Ground clearance`,max_slope_deg:`Slope limit`,drive_force_max_N:`Drive force`,drive_efficiency:`Drive efficiency`},Ud={mass_kg:`kg`,wheel_count:``,wheel_radius_m:`m`,wheel_width_m:`m`,top_speed_ms:`m/s`,motor_power_w:`W`,battery_wh:`Wh`,base_power_w:`W`,ground_clearance_m:`m`,max_slope_deg:`deg`,drive_force_max_N:`N`,drive_efficiency:``},Wd={color:`#ffffff`,dust:0,decal:``},Gd=(e,t,n)=>Math.max(t,Math.min(n,e));function Kd(e){let t=e.gravity_mps2,n={},r=[],i=r=>{if(n[r])return n[r];let a=e.rovers.find(e=>e.id===r);if(!a)throw Error(`unknown rover `+r);let o=a.inherit?i(a.inherit):null,s={...o||{},...a,fig:{...o?o.fig:{}}};for(let[e,t]of Object.entries(a.fig||{}))s.fig[e]={...t};for(let[e,n]of Object.entries(a.fig_override||{}))if(n.derive_from){let[r,a]=n.derive_from.split(`.`),o=i(r).fig[a],c=n.scale.split(`/`).map(e=>t[e.replace(`g_`,``)]);s.fig[e]={value:+(o.value*c[0]/c[1]).toFixed(1),unit:n.unit,source_id:n.source_id,verified:!1,derived:!0,note:`derived from ${r} ${a}`}}else s.fig[e]={...n};return s.limits=e.limits[s.planet],n[r]=s,s};return e.rovers.forEach(e=>{i(e.id),r.push(e.id)}),{rovers:n,order:r,raw:e,soils:e.soils,sources:e.sources,G:t,defaults:e.defaults_by_body}}var qd=(e,t)=>({id:e in t.rovers?e:t.order[0],ov:{},cos:{...Wd}});function Jd(e,t,n){let r=e.limits?.[t];return!r||!Number.isFinite(+n)?+n:(n=Gd(+n,r[0],r[1]),t===`wheel_count`?n>=5?6:4:n)}function Yd(e,t){let n=e.rovers[t.id],r={},i=[];for(let e of Vd){let a=n.fig[e].value;if(t.ov&&t.ov[e]!=null){let o=Jd(n,e,t.ov[e]);Math.abs(o-a)>1e-9*Math.max(1,Math.abs(a))&&(r[e]=o,i.push(e))}}let a=e=>e in r?r[e]:n.fig[e].value,o=n.geometry,s=a(`wheel_count`),c=a(`wheel_radius_m`),l=n.fig.wheel_radius_m.value,u=a(`motor_power_w`),d=a(`top_speed_ms`),f=n.fig.drive_force_max_N.value,p=n.fig.motor_power_w.value,m=n.fig.top_speed_ms.value,h=o.hubs.length===6,g={};for(let e of o.hubs)s===4&&h&&/wheel_02_/.test(e.name)||(g[e.name]=[e.u,e.v]);if(s===6&&!h){let e=o.mid_wheel_x_m||o.track_m/2*1.1;g.wheel_02_L=[0,e],g.wheel_02_R=[0,-e]}let _=Object.values(g),v={};for(let e of[...Bd,`drive_force_max_N`,`drive_efficiency`])v[e]={...n.fig[e],...e in r?{value:r[e],source_id:`user`,verified:!1,user:!0}:{}};let y=u/p*f*(m/d);return v.drive_force_max_N={...v.drive_force_max_N,value:y,...i.some(e=>e===`motor_power_w`||e===`top_speed_ms`)?{source_id:`user`,verified:!1,user:!0,note:`scaled from the preset: proportional to motor power, inversely to top speed`}:{}},v.ground_clearance_m={...v.ground_clearance_m,value:Math.max(.05,n.fig.ground_clearance_m.value+(c-l)),...c===l?{}:{note:`preset clearance plus the change in wheel radius`}},{id:n.id,name:n.display_name,mission:n.mission,planet:n.planet,kind:i.length?`custom`:n.badge,changed:i,base_badge:n.badge,mass_kg:a(`mass_kg`),n_wheels:s,wheel_radius_m:c,wheel_width_m:a(`wheel_width_m`),max_speed_mps:d,drive_power_max_W:u,battery_wh:a(`battery_wh`),base_power_W:n.fig.base_power_w.value,drive_force_max_N:y,drive_efficiency:n.fig.drive_efficiency.value,slope_limit_deg:n.fig.max_slope_deg.value,ground_clearance_m:v.ground_clearance_m.value,wheelbase_m:o.wheelbase_m,track_m:o.track_m,mid_wheel_x_m:o.mid_wheel_x_m||o.track_m/2*1.1,wheel_pts:_,hub_by_name:g,model:n.model_file,model_scale:n.model_scale||1,wheel_nodes:n.wheel_node_names,wheel_radius_model_m:o.wheel_radius_model_m,wheel_width_model_m:o.wheel_width_model_m,model_dims:[o.model_width_m,o.model_height_m,o.model_length_m],fig:v,note:n.note||``,cos:{...Wd,...t.cos||{}}}}function Xd(e){return JSON.stringify({app:`TerraAnalog rover build`,version:1,id:e.id,overrides:e.ov,cosmetic:e.cos},null,1)}function Zd(e,t){let n;try{n=JSON.parse(t)}catch{throw Error(`Not a JSON file`)}if(!n||n.app!==`TerraAnalog rover build`||!(n.id in e.rovers))throw Error(`Not a TerraAnalog rover build, or the rover is unknown`);let r=e.rovers[n.id],i={};for(let e of Vd)n.overrides&&Number.isFinite(+n.overrides[e])&&(i[e]=Jd(r,e,n.overrides[e]));let a=n.cosmetic||{};return{id:n.id,ov:i,cos:{color:/^#[0-9a-f]{6}$/i.test(a.color)?a.color:`#ffffff`,dust:Gd(+a.dust||0,0,1),decal:String(a.decal||``).replace(/[^0-9A-Za-z]/g,``).slice(0,3)}}}var Qd=`terraanalog.rover.build`;function $d(e){try{localStorage.setItem(Qd,Xd(e))}catch{}}function ef(e){try{let t=localStorage.getItem(Qd);return t?Zd(e,t):null}catch{return null}}var Y={reg:null,build:null,cfg:null,listeners:new Set,templates:new Map,instances:new Set,stats:{loaded:0,disposedGeometries:0,disposedMaterials:0,disposedTextures:0}};window.TERRA_ROVERS=Y;function tf(e,t){Y.error=null,Y.modelError=null;try{Y.reg=Kd(e);let n=ef(Y.reg);Y.recalled=!!n,Y.picked=!1,of(n||qd(Y.reg.defaults[t]||Y.reg.order[0],Y.reg),!0)}catch(e){console.error(`Rover registry failed, using the built-in stand-in rover`,e),Y.error=`Could not load the rover registry (${e&&e.message?e.message:e}). A simple built-in rover is used.`,Y.reg=Kd(zd),Y.recalled=!1,Y.picked=!1,of(qd(`fallback`,Y.reg),!0)}}function nf(e){return Y.reg.defaults[e]||Y.reg.order[0]}var rf=e=>Y.listeners.forEach(t=>t(e,Y.cfg)),af=e=>(Y.listeners.add(e),()=>Y.listeners.delete(e));function of(e,t){let n=!Y.build||Y.build.id!==e.id;Y.build={id:e.id,ov:{...e.ov||{}},cos:{...Wd,...e.cos||{}}},Y.cfg=Yd(Y.reg,Y.build),Y.error||$d(Y.build),t||rf(n?`rover`:`config`)}var sf=e=>Yd(Y.reg,e);function cf(e){e!==Y.build.id&&of({id:e,ov:{},cos:Y.build.cos})}function lf(e,t){let n=Y.reg.rovers[Y.build.id],r={...Y.build.ov},i=Jd(n,e,t);Math.abs(i-n.fig[e].value)<1e-9*Math.max(1,Math.abs(i))?delete r[e]:r[e]=i,of({...Y.build,ov:r})}function uf(e,t){of({...Y.build,cos:{...Y.build.cos,[e]:t}})}function df(){of({id:Y.build.id,ov:{},cos:{...Wd}})}function ff(e){of(Zd(Y.reg,e))}var pf=()=>Xd(Y.build),mf=()=>{let e=new tl;return e.setMeshoptDecoder(Ql),e};function hf(e){return Y.templates.has(e)||Y.templates.set(e,mf().loadAsync($l+e).then(e=>(Y.stats.loaded++,gf(e.scene),e.scene)).catch(t=>{throw Y.templates.delete(e),t})),Y.templates.get(e)}function gf(e){let t=e=>/^wheel_\d\d_[LR]$/.test(e.name),n=new H,r=new H,i=new V,a=new U,o=new U;e.updateMatrixWorld(!0);let s=new Map;e.traverse(n=>{if(!n.isMesh||n.isSkinnedMesh||n.morphTargetInfluences||Array.isArray(n.material)||!n.visible||t(n))return;let r=n.parent;for(;r&&r!==e&&!t(r);)r=r.parent;let i=r&&r!==e?r:e,a=Object.keys(n.geometry.attributes).sort().join(`,`)+(n.geometry.index?`|i`:``);n.geometry.boundingSphere||n.geometry.computeBoundingSphere();let o=n.matrixWorld.getMaxScaleOnAxis(),c=i===e&&n.geometry.boundingSphere.radius*o<.03,l=i.uuid+`|`+n.material.uuid+`|`+a+(c?`|tiny`:``);s.has(l)||s.set(l,{owner:i,mat:n.material,meshes:[],tiny:c}),s.get(l).meshes.push(n),c&&(n.userData.tiny=!0)});for(let{owner:e,mat:t,meshes:c,tiny:l}of s.values()){if(c.length<2)continue;o.copy(e.matrixWorld).invert();let s=Object.keys(c[0].geometry.attributes).filter(e=>e===`position`||e===`normal`||e===`uv`||e===`color`),u=c.reduce((e,t)=>e+t.geometry.attributes.position.count,0),d=Object.fromEntries(s.map(e=>[e,new Float32Array(u*c[0].geometry.attributes[e].itemSize)])),f=[],p=0;for(let e of c){let t=e.geometry,s=t.attributes.position;a.multiplyMatrices(o,e.matrixWorld),i.getNormalMatrix(a);for(let e=0;e<s.count;e++){if(n.fromBufferAttribute(s,e).applyMatrix4(a),d.position.set([n.x,n.y,n.z],(p+e)*3),d.normal&&(r.fromBufferAttribute(t.attributes.normal,e).applyMatrix3(i).normalize(),d.normal.set([r.x,r.y,r.z],(p+e)*3)),d.uv){let n=t.attributes.uv;d.uv.set([n.getX(e),n.getY(e)],(p+e)*2)}if(d.color){let n=t.attributes.color,r=n.itemSize;for(let t=0;t<r;t++)d.color[(p+e)*r+t]=n.getComponent(e,t)}}if(t.index)for(let e=0;e<t.index.count;e++)f.push(p+t.index.getX(e));else for(let e=0;e<s.count;e++)f.push(p+e);if(a.determinant()<0)for(let e=f.length-(t.index?t.index.count:s.count);e<f.length;e+=3){let t=f[e];f[e]=f[e+1],f[e+1]=t}p+=s.count,e.parent.remove(e),t.dispose()}let m=new Gn;for(let e of s)m.setAttribute(e,new Pn(d[e],c[0].geometry.attributes[e].itemSize));m.setIndex(u>65535?new In(f,1):new Fn(f,1)),m.computeBoundingSphere();let h=new lr(m,t);h.name=`merged_`+(t.name||`mat`),h.userData.tiny=!!l,e.add(h)}}function _f(e,t=!0){let n=new Set;e.traverse(e=>{e.geometry&&!n.has(e.geometry)&&(n.add(e.geometry),e.geometry.dispose(),t&&Y.stats.disposedGeometries++);for(let t of[].concat(e.material||[]))if(!n.has(t)){n.add(t);for(let e in t){let r=t[e];r&&r.isTexture&&!n.has(r)&&(n.add(r),r.dispose(),Y.stats.disposedTextures++)}t.dispose(),Y.stats.disposedMaterials++}})}async function vf(e){let t=Y.stats.disposedGeometries;for(let[t,n]of[...Y.templates])if(t!==e){Y.templates.delete(t);try{_f(await n)}catch{}}return Y.stats.disposedGeometries-t}function yf(e){let t=new Ao,n=e.wheel_radius_model_m||.25,r=e.wheel_width_model_m||.2,i=Object.entries(e.hub_by_name),a=i.map(e=>e[1][0]),o=new lr(new fr((e.track_m||1.4)*.8,.4,Math.max(1.2,Math.max(...a)-Math.min(...a)+.9)),new Rs({color:12172742,roughness:.7}));o.position.y=n+.45,t.add(o);let s=new Rs({color:2830134,roughness:.9}),c=new Ms(n,n,r,20);for(let[e,[r,a]]of i){let i=new Ao,o=new lr(c,s);o.rotation.z=Math.PI/2,i.add(o),i.name=e,i.position.set(a,n,r),t.add(i)}return t}async function bf(e){Y.modelError=null;try{return e.model?Sf(e,await hf(e.model),!1):Sf(e,yf(e),!0)}catch(t){return console.error(`Rover model failed`,t),Y.modelError=`Could not load the rover model (${e.model}): ${t&&t.message?t.message:t}. A simple box rover is shown instead.`,Sf(e,yf(e),!0)}}var xf=new H;function Sf(e,t,n){let r=t.clone(!0),i=new Ao,a=new Ao,o=[],s=e=>/^wheel_\d\d_[LR]$/.test(e.name);r.traverse(e=>{if(e.isMesh){e.castShadow=!0;let t=e;for(;t&&!s(t);)t=t.parent;e.userData.isWheelPart=!!t,e.material=Array.isArray(e.material)?e.material.map(e=>e.clone()):e.material.clone();for(let t of[].concat(e.material))t.transmission>0&&(t.transmission=0,t.transparent=!0,t.opacity=Math.min(t.opacity,.4),t.depthWrite=!1),t.metalness>.35&&(t.metalness=.35),t.userData.base=t.color?t.color.clone():null,o.push([t,e.userData.isWheelPart])}}),r.updateMatrixWorld(!0),r.traverse(e=>{e.isMesh&&!e.userData.isWheelPart&&(e.geometry.boundingSphere||e.geometry.computeBoundingSphere(),e.geometry.boundingSphere.radius*e.matrixWorld.getMaxScaleOnAxis()<.12&&(e.castShadow=!1))}),a.add(r),i.add(a),a.scale.setScalar(e.model_scale);let c={root:i,lift:a,model:r,mats:o,cfg:null,wheels:[],file:e.model,decal:null,extra:[],own:n,dispose(){Tf(c)}},l={};e.wheel_nodes.forEach(e=>{l[e]=r.getObjectByName(e)}),c.nodes=l,c.y0={},c.s0={};for(let e in l)l[e]&&(c.y0[e]=l[e].position.y,c.s0[e]=l[e].scale.clone());return Y.instances.add(c),Cf(c,e),c}function Cf(e,t){e.cfg=t;let n=t.wheel_radius_m/t.wheel_radius_model_m,r=t.wheel_width_m/t.wheel_width_model_m;e.lift.position.y=t.wheel_radius_m-t.wheel_radius_model_m,e.extra.forEach(e=>e.parent&&e.parent.remove(e)),e.extra=[];let i=t.n_wheels===6,a=t.wheel_nodes.some(e=>e.startsWith(`wheel_02_`));for(let o of t.wheel_nodes){let t=e.nodes[o];t&&(t.visible=!(o.startsWith(`wheel_02_`)&&!i&&a),t.scale.copy(e.s0[o]).multiply(xf.set(r,n,n)))}if(i&&!a)for(let t of[`L`,`R`]){let n=e.nodes[`wheel_01_`+t];if(!n)continue;let r=n.clone();r.name=`wheel_02_`+t,r.position.z=0,n.parent.add(r),e.extra.push(r),e.nodes[r.name]=r,e.y0[r.name]=r.position.y,e.s0[r.name]=e.s0[`wheel_01_`+t].clone()}e.wheels=Object.keys(t.hub_by_name).filter(t=>e.nodes[t]).map(n=>({node:e.nodes[n],name:n,u:t.hub_by_name[n][0],v:t.hub_by_name[n][1],y0:e.y0[n]}));let o=new W(t.cos.color),s=new W(.62,.5,.38),c=t.cos.dust;for(let[t,n]of e.mats)t.userData.base&&(t.color.copy(t.userData.base),n||t.color.multiply(o),c>0&&t.color.lerp(s,.65*c));wf(e,t)}function wf(e,t){e.decal&&=(e.decal.parent&&e.decal.parent.remove(e.decal),e.decal.material.map.dispose(),e.decal.material.dispose(),e.decal.geometry.dispose(),null);let n=t.cos.decal;if(!n)return;let r=document.createElement(`canvas`);r.width=256,r.height=160;let i=r.getContext(`2d`);i.fillStyle=`#f4f4f0`,i.fillRect(0,0,256,160),i.strokeStyle=`#1b1f27`,i.lineWidth=8,i.strokeRect(4,4,248,152),i.fillStyle=`#1b1f27`,i.font=`bold 110px sans-serif`,i.textAlign=`center`,i.textBaseline=`middle`,i.fillText(n,128,88);let a=new js(r),o=new lr(new Lr(.5,.31),new jn({map:a,side:2})),s=t.wheel_pts.map(e=>e[0]);o.position.set(0,.95,Math.min(...s)-.62),o.rotation.y=Math.PI,e.model.add(o),e.decal=o}function Tf(e){Y.instances.delete(e),e.root.parent&&e.root.parent.remove(e.root);for(let[t]of e.mats)t.dispose(),Y.stats.disposedMaterials++;e.own&&e.model.traverse(e=>{e.geometry&&(e.geometry.dispose(),Y.stats.disposedGeometries++)}),e.decal&&(e.decal.material.map.dispose(),e.decal.material.dispose(),e.decal.geometry.dispose())}var Ef=e=>document.getElementById(e),Df={mars:`Mars rover`,moon:`Moon rover`,test:`Earth test rover`},Of={mass_kg:e=>e.toFixed(0),wheel_count:e=>e.toFixed(0),wheel_radius_m:e=>e.toFixed(3),wheel_width_m:e=>e.toFixed(3),top_speed_ms:e=>e.toFixed(3),motor_power_w:e=>e.toFixed(0),battery_wh:e=>e.toFixed(0),base_power_w:e=>e.toFixed(0),ground_clearance_m:e=>e.toFixed(2),max_slope_deg:e=>e.toFixed(0),drive_force_max_N:e=>e.toFixed(0),drive_efficiency:e=>e.toFixed(2)},kf={mass_kg:5,wheel_radius_m:.005,wheel_width_m:.005,motor_power_w:5,battery_wh:10,top_speed_ms:.001},Af=e=>String(e).replace(/[&<>"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`})[e]),jf={ctx:()=>null},Mf=(e,t)=>Of[e](t)+(Ud[e]?` `+Ud[e]:``),Nf={pick:`<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2.5 5.5h10M10 3l2.5 2.5L10 8M13.5 10.5h-10M6 8l-2.5 2.5L6 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,cust:`<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 4h7M12 4h2M2 8h2M7 8h7M2 12h8M13 12h1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10.5" cy="4" r="1.6" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="5.5" cy="8" r="1.6" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="11.5" cy="12" r="1.6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`,cmp:`<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="1.8" y="2.5" width="5.2" height="11" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="9" y="2.5" width="5.2" height="11" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`},Pf=(e,t,n,r)=>`<button type="button" class="rv-act${r?` alt`:``}" ${e}>${Nf[t]}<span>${n}</span></button>`,Ff=null,If=null;function Lf(e){Object.assign(jf,e),Ef(`site`).insertAdjacentHTML(`beforeend`,`
    <div id="rvPicker" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="rvPickT"><div class="modal-card rv-card"><button class="btn ghost close" data-close aria-label="Close">Close</button>
      <h1 id="rvPickT">Choose a rover ${r(`Each rover uses NASA's 3D model and published figures where they exist. Any rover can be tried on any ground.`,`About the rovers`)}</h1><div class="rv-cards" id="rvCards"></div></div></div>
    <div id="rvDrawer" class="rv-drawer hidden" role="dialog" aria-modal="false" aria-labelledby="rvDrawT"><div class="rv-dhead"><h2 id="rvDrawT">Customize rover</h2><button class="icon-btn" data-close aria-label="Close the customize panel">&times;</button></div><div class="rv-dbody" id="rvDrawBody"></div></div>
    <div id="rvCompare" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="rvCmpT"><div class="modal-card rv-card wide"><button class="btn ghost close" data-close aria-label="Close">Close</button>
      <h1 id="rvCmpT">Compare two rover builds ${r(`Both builds drive the same route on the same ground. Green marks the better of the two values. Reachable means the route fits the battery, the slope limit and the pushing force.`,`About comparing builds`)}</h1><div id="rvCmpBody"></div></div></div>`),Ef(`rvPicker`).addEventListener(`click`,e=>{(e.target===Ef(`rvPicker`)||e.target.closest(`[data-close]`))&&Gf()});{let e=Ef(`rvCompare`);e.addEventListener(`click`,t=>{(t.target===e||t.target.closest(`[data-close]`))&&e.classList.add(`hidden`)})}Ef(`rvDrawer`).addEventListener(`click`,e=>{e.target.closest(`[data-close]`)&&Jf()}),document.addEventListener(`keydown`,zf),Hf()}var Rf=e=>{let t=Ef(e);return!!t&&!t.classList.contains(`hidden`)},zf=e=>{if(e.key===`Escape`){if(Rf(`rvPicker`))Gf();else if(Rf(`rvCompare`))Ef(`rvCompare`).classList.add(`hidden`);else if(Kf&&Rf(`rvDrawer`))Jf();else return;e.stopPropagation()}};function Bf(){document.removeEventListener(`keydown`,zf),Kf=!1,Ff=null,If=null}function Vf(e){return`<div class="rv-sum"><div class="rv-name"><b>${Af(e.name)}</b><small>${Af(e.mission)} &middot; ${Af(Df[e.planet])}</small></div>
    <div class="rv-figs">${[`mass_kg`,`wheel_count`,`wheel_radius_m`,`wheel_width_m`,`top_speed_ms`].map(t=>`<span>${Af(Hd[t])} <b>${Mf(t,t===`wheel_count`?e.n_wheels:e.fig[t].value)}</b></span>`).join(``)}</div></div>`}function Hf(){let e=Ef(`roverBar`);if(e&&Y.cfg&&(e.innerHTML=Vf(Y.cfg)+`<div class="rv-actions">${Pf(`id="rvPick"`,`pick`,`Change rover`)}${Pf(`id="rvCust"`,`cust`,`Customize`)}${Pf(`id="rvCmp"`,`cmp`,`Compare two builds`,!0)}</div>`,Ef(`rvPick`).onclick=()=>Wf(null,()=>Ef(`rvPick`)&&Ef(`rvPick`).focus()),Ef(`rvCust`).onclick=()=>qf(),Ef(`rvCmp`).onclick=()=>$f(),!Ef(`rvDrawer`).classList.contains(`hidden`))){let e=Ef(`rvDrawBody`),t=document.activeElement;if(t&&t.type===`range`&&e.contains(t)){Ef(`rvRead`).innerHTML=Xf(Y.cfg);let t=e.querySelector(`.rv-sum2`);t&&(t.innerHTML=Vf(Y.cfg)+(Y.cfg.kind===`custom`?`<p class="hint">Changed from the preset: ${Y.cfg.changed.map(e=>Hd[e].toLowerCase()).join(`, `)}. This is a custom build, not a real mission rover.</p>`:``))}else Zf(!0)}}function Uf(e,t){let n=()=>{e.innerHTML=Vf(Y.cfg)+`<div class="rv-actions">${Pf(`data-a="pick"`,`pick`,`Change rover`)}${Pf(`data-a="cust"`,`cust`,`Customize`)}</div>`};n();let r=e.closest(`.modal`),i=i=>()=>{if(n(),t&&t(),r){r.classList.remove(`hidden`);let t=e.querySelector(`[data-a="${i}"]`);t&&t.focus()}};return e.onclick=e=>{let t=e.target.closest(`[data-a]`)?.dataset.a;t&&(r&&r.classList.add(`hidden`),t===`pick`&&Wf(null,i(`pick`)),t===`cust`&&qf(i(`cust`)))},n}function Wf(e,t){Ff=t||null;let n=Y.reg.order.map(e=>{let t=Y.reg.rovers[e],n=sf({id:e,ov:{},cos:{}});return`<button class="rcard rv-pick${e===Y.build.id?` active`:``}" data-id="${e}"><img src="${$l}assets/models/previews/${t.inherit||e}.png" alt="" width="160" height="100" loading="lazy"><div class="t"><span>${Af(t.display_name)}</span></div>
      <div class="n">${Af(t.mission)} &middot; ${Af(Df[t.planet])}</div><div class="n">${n.mass_kg.toFixed(0)} kg, ${n.n_wheels} wheels, wheel radius ${n.wheel_radius_m} m</div></button>`}).join(``);Ef(`rvCards`).innerHTML=n,Ef(`rvCards`).onclick=t=>{let n=t.target.closest(`.rv-pick`);n&&(Y.picked=!0,cf(n.dataset.id),e&&e(),Gf())},Ef(`rvPicker`).classList.remove(`hidden`);let r=Ef(`rvCards`).querySelector(`.rv-pick.active`)||Ef(`rvCards`).querySelector(`.rv-pick`);r&&r.focus()}function Gf(){Ef(`rvPicker`).classList.add(`hidden`);let e=Ff;Ff=null,e&&e()}var Kf=!1;function qf(e){if(If=e||null,Ef(`rvDrawer`).classList.remove(`hidden`),Kf=!0,Zf(!1),If){let e=Ef(`rvDrawer`).querySelector(`[data-close]`);e&&e.focus()}}function Jf(){Ef(`rvDrawer`).classList.add(`hidden`),Kf=!1;let e=If;If=null,e&&e()}function Yf(e,t){let n=e.limits?.[t]||Y.reg.rovers[e.id].limits[t],r=e.fig[t],i=t===`wheel_count`?e.n_wheels:r.value;return t===`wheel_count`?`<div class="rv-row"><label>${Hd[t]}</label><div class="seg" role="group" aria-label="Wheel count">${[4,6].map(t=>`<button data-wc="${t}" class="${e.n_wheels===t?`on`:``}">${t}</button>`).join(``)}</div><span class="rv-t"></span></div>`:`<div class="rv-row"><label for="rv_${t}">${Hd[t]}</label><input id="rv_${t}" data-k="${t}" type="range" min="${n[0]}" max="${n[1]}" step="${kf[t]}" value="${i}"><output id="rvo_${t}">${Mf(t,i)}</output><span class="rv-t"></span></div>`}function Xf(e){let t=jf.ctx();if(!t)return``;let n=t.grounds.map(t=>({g:t,e:bu(e,t.S,{g:t.g,mu:t.mu,crr:Mu(t.soil),mass:e.mass_kg})})),r=(e,t,r)=>`<tr><td title="${Af(r||``)}">${e}</td>${n.map(({e})=>`<td>${t(e)}</td>`).join(``)}</tr>`,i=e=>e>=1e3?(e/1e3).toFixed(2)+` km`:e.toFixed(0)+` m`;return`<table class="rv-read"><thead><tr><th></th>${n.map(({g:e},t)=>`<th class="${t?`e`:`t`}">${Af(e.label)}<small>g ${e.g} &middot; ${Af(e.cls)}</small></th>`).join(``)}</tr></thead><tbody>
    ${r(`Weight`,e=>e.weightN.toFixed(0)+` N`,`mass times local gravity`)}
    ${r(`Ground pressure`,e=>e.pressure_kPa.toFixed(1)+` kPa`,`wheel load divided by wheel width times contact length`)}
    ${r(`Expected sinkage`,e=>(1e3*e.sinkage_m).toFixed(1)+` mm`,`simplified Bekker sinkage on the ground class, assumed soil constants`)}
    ${r(`Top speed here`,e=>e.canMove?e.topSpeed.toFixed(3)+` m/s`:`stuck`,`flat ground, force balance with motor, power and traction limits`)}
    ${r(`Range on battery`,e=>e.canMove?i(e.rangeM):`0 m`,`flat ground at that speed, drive plus base power`)}</tbody></table>`}function Zf(e){let t=Ef(`rvDrawBody`),n=t.scrollTop,i=Y.cfg,a=Y.reg.rovers[i.id];t.innerHTML=`
    <div class="rv-sum2">${Vf(i)}${i.note?`<p class="hint">${Af(i.note)}</p>`:``}${i.kind===`custom`?`<p class="hint">Changed from the ${Af(a.display_name)} preset: ${i.changed.map(e=>Hd[e].toLowerCase()).join(`, `)}. This is a custom build, not a real mission rover.</p>`:``}</div>
    <h3>Rover</h3><div class="rv-presets">${Y.reg.order.map(e=>`<button class="btn small${e===i.id?` on`:``}" data-pre="${e}">${Af(Y.reg.rovers[e].display_name)}</button>`).join(``)}</div>
    <h3>Build (changes the physics) ${r(`Sliders stay within realistic limits. More motor power means more pushing force, and a higher top speed means less. Bigger, wider wheels sink less.`,`About the build sliders`)}</h3>${Vd.map(e=>Yf(i,e)).join(``)}
    <h3>Fixed figures of the preset</h3><div class="rv-fixed">${[`base_power_w`,`ground_clearance_m`,`max_slope_deg`,`drive_force_max_N`,`drive_efficiency`].map(e=>`<div><span>${Hd[e]}</span><b>${Mf(e,i.fig[e].value)}</b></div>`).join(``)}</div>
    <h3>Live readout on each ground ${r(`Quick estimates for each ground. The soil numbers are simplified guesses, not measured here.`,`About the live readout`)}</h3><div id="rvRead">${Xf(i)}</div>
    <h3>Looks only (no effect on the physics)</h3>
    <div class="rv-row"><label for="rv_col">Body colour</label><input id="rv_col" type="color" value="${i.cos.color}"><span></span><span class="rv-t"></span></div>
    <div class="rv-row"><label for="rv_dust">Dust level</label><input id="rv_dust" type="range" min="0" max="1" step="0.05" value="${i.cos.dust}"><output>${(100*i.cos.dust).toFixed(0)} %</output><span class="rv-t"></span></div>
    <div class="rv-row"><label for="rv_dec">Number plate</label><input id="rv_dec" type="text" maxlength="3" value="${Af(i.cos.decal)}" placeholder="e.g. 7"><span></span><span class="rv-t"></span></div>
    <div class="rv-foot"><button class="btn small" id="rvReset">Reset to preset</button><button class="btn small" id="rvSave">Save as JSON</button><label class="btn small">Load JSON<input id="rvLoad" type="file" accept="application/json,.json" hidden></label></div><div id="rvMsg" class="hint" role="status"></div>`,e&&(t.scrollTop=n),t.oninput=e=>{let t=e.target;t.dataset.k?(Ef(`rvo_`+t.dataset.k).textContent=Mf(t.dataset.k,+t.value),lf(t.dataset.k,+t.value)):t.id===`rv_col`?uf(`color`,t.value):t.id===`rv_dust`?(t.nextElementSibling.textContent=(100*t.value).toFixed(0)+` %`,uf(`dust`,+t.value)):t.id===`rv_dec`&&uf(`decal`,t.value.replace(/[^0-9A-Za-z]/g,``).slice(0,3))},t.onclick=e=>{let t=e.target.closest(`button`);if(t){if(t.dataset.wc)lf(`wheel_count`,+t.dataset.wc);else if(t.dataset.pre)Y.picked=!0,cf(t.dataset.pre);else if(t.id===`rvReset`)df();else if(t.id===`rvSave`){let e=new Blob([pf()],{type:`application/json`}),t=document.createElement(`a`);t.href=URL.createObjectURL(e),t.download=`terraanalog-rover-${Y.build.id}.json`,t.click(),setTimeout(()=>URL.revokeObjectURL(t.href),4e3)}}};let o=Ef(`rvLoad`);o&&(o.onchange=async()=>{try{ff(await o.files[0].text()),Y.picked=!0,Ef(`rvMsg`).textContent=`Loaded.`}catch(e){Ef(`rvMsg`).textContent=e.message}o.value=``})}var Qf={A:null,B:null,ground:0};function $f(){Qf.A={id:Y.build.id,ov:{...Y.build.ov},cos:{}},Qf.B=Qf.B&&Qf.B.id in Y.reg.rovers?Qf.B:{id:Y.build.id,ov:{...Y.build.ov},cos:{}},rp(),Ef(`rvCompare`).classList.remove(`hidden`)}function ep(e){let t=Yd(Y.reg,Qf[e]),n=Y.reg.rovers[t.id];return`<div class="rv-col" data-w="${e}"><h3>Build ${e}</h3><select aria-label="Rover for build ${e}" data-sel>${Y.reg.order.map(e=>`<option value="${e}"${e===t.id?` selected`:``}>${Af(Y.reg.rovers[e].display_name)}</option>`).join(``)}</select>
    ${Vd.map(e=>{let r=n.limits[e],i=e===`wheel_count`?t.n_wheels:t.fig[e].value;return e===`wheel_count`?`<div class="rv-row"><label>${Hd[e]}</label><div class="seg">${[4,6].map(e=>`<button data-wc="${e}" class="${t.n_wheels===e?`on`:``}">${e}</button>`).join(``)}</div><span class="rv-t"></span></div>`:`<div class="rv-row"><label>${Hd[e]}</label><input data-k="${e}" type="range" min="${r[0]}" max="${r[1]}" step="${kf[e]}" value="${i}"><output>${Mf(e,i)}</output><span class="rv-t"></span></div>`}).join(``)}</div>`}function tp(){return jf.ctx().grounds[Qf.ground]}function np(e){let t=tp(),n=Yd(Y.reg,e);jf.ctx();let r=Fu(t.patch,t.route,n,{g:t.g,mass:n.mass_kg,mu:t.mu,soil:t.soil,S:t.S}).totals;return{cfg:n,T:r,e:bu(n,t.S,{g:t.g,mu:t.mu,crr:Mu(t.soil)}),vmean:r.dist/r.time}}function rp(){let e=jf.ctx(),t=Ef(`rvCmpBody`);if(!e){t.innerHTML=`<p class="hint">Open a place first.</p>`;return}let n=np(Qf.A),r=np(Qf.B),i=tp(),a=(e,t,n)=>Math.abs(e-t)/Math.max(1e-9,Math.abs(e),Math.abs(t))<.01?``:(n?e<t:e>t)?`win`:``,o=(e,t,i,o,s)=>{let c=i(n),l=i(r);return`<tr><td title="${Af(s||``)}">${e}</td><td class="${a(c,l,o)}">${t(c)}</td><td class="${a(l,c,o)}">${t(l)}</td></tr>`},s=e=>e.T.reachable?`<span class="tagm ok">reachable</span>`:`<span class="tagm no">not reachable</span><small class="blk">${e.T.blockers.map(Af).join(`; `)}</small>`;t.innerHTML=`<div class="rv-gsel" role="group" aria-label="Ground">${e.grounds.map((e,t)=>`<button data-g="${t}" class="btn small${t===Qf.ground?` on`:``}">${Af(e.label)}: ${Af(e.short)}</button>`).join(``)}</div>
    <div class="rv-two">${ep(`A`)}${ep(`B`)}</div>
    <table class="rv-read cmp2"><thead><tr><th>Same route on ${Af(i.short)} (g ${i.g}, ${Af(i.cls)})</th><th>Build A</th><th>Build B</th></tr></thead><tbody>
    ${o(`Top speed here (flat)`,e=>e.toFixed(3)+` m/s`,e=>e.e.topSpeed,!1,`force balance with motor, power and traction limits`)}
    ${o(`Mean speed on the route`,e=>e.toFixed(3)+` m/s`,e=>e.vmean,!1)}
    ${o(`Drive time`,e=>(e/60).toFixed(0)+` min`,e=>e.T.time,!0)}
    ${o(`Energy per metre`,e=>e.toFixed(0)+` J/m`,e=>e.T.e_mean,!0)}
    ${o(`Energy for the route`,e=>e.toFixed(0)+` Wh`,e=>e.T.energy_Wh,!0,`drive energy plus base power over the drive time`)}
    ${o(`Battery`,e=>e.toFixed(0)+` Wh`,e=>e.T.battery_wh,!1)}
    ${o(`Mean sinkage`,e=>e.toFixed(1)+` mm`,e=>e.T.sink_mean_mm,!0,`simplified Bekker sinkage, assumed soil constants`)}
    ${o(`Ground pressure`,e=>e.toFixed(1)+` kPa`,e=>e.T.press_kPa,!0)}
    <tr><td>Verdict</td><td>${s(n)}</td><td>${s(r)}</td></tr></tbody></table>`,t.oninput=e=>{let t=e.target;if(!t.dataset.k)return;let n=t.closest(`[data-w]`).dataset.w,r=Y.reg.rovers[Qf[n].id],i=Math.max(r.limits[t.dataset.k][0],Math.min(r.limits[t.dataset.k][1],+t.value));Qf[n]={...Qf[n],ov:{...Qf[n].ov,[t.dataset.k]:i}},t.nextElementSibling.textContent=Mf(t.dataset.k,i),ip()},t.onchange=e=>{if(e.target.matches(`[data-sel]`)){let t=e.target.closest(`[data-w]`).dataset.w;Qf[t]={id:e.target.value,ov:{},cos:{}},rp()}},t.onclick=e=>{let t=e.target.closest(`button`);if(t){if(t.dataset.g)Qf.ground=+t.dataset.g,rp();else if(t.dataset.wc){let e=t.closest(`[data-w]`).dataset.w;Qf[e]={...Qf[e],ov:{...Qf[e].ov,wheel_count:+t.dataset.wc}},rp()}}}}function ip(){let e=document.activeElement?.dataset?.k,t=document.activeElement?.closest(`[data-w]`)?.dataset.w,n=Ef(`rvCmpBody`),r=n.parentElement.scrollTop;if(rp(),n.parentElement.scrollTop=r,e){let r=n.querySelector(`[data-w="${t}"] [data-k="${e}"]`);r&&r.focus()}}var ap=[.5,1,2,4],op=`rsim.vr.controlsSeen.v1`,sp={mars:`Mars`,moon:`Moon`,earth:`Earth`},cp=[[`play`,`Play / pause`],[`restart`,`Restart`],[`mode`,`View mode`],[`side`,`Switch ground`],[`speed`,`Speed`],[`rings`,`Slip rings`],[`exit`,`Exit VR`]],X=null,Z=null,lp={get:e=>{try{return localStorage.getItem(e)}catch{return null}},set:(e,t)=>{try{localStorage.setItem(e,t)}catch{}}},up=(e,t,n)=>Math.max(t,Math.min(n,e)),dp=new H,fp=new H,pp=new ut;new U;async function mp(e){X=e;let t=e.slot();if(!t)return;t.innerHTML=``;let n=!1;try{n=!!(navigator.xr&&await navigator.xr.isSessionSupported(`immersive-vr`))}catch{n=!1}X===e&&e.slot()===t&&(n?(t.innerHTML=`<button id="vrBtn" class="btn small vr-btn" aria-label="View the simulation in a VR headset">View in VR</button>`,t.querySelector(`#vrBtn`).onclick=()=>{vp().catch(e=>{console.error(e),X.siteNote&&X.siteNote(`VR could not start: ${e.message||e}`)})}):t.innerHTML=r(`VR needs a headset such as Meta Quest connected to this computer.`,`About VR`))}function hp(e,t,n,r){let i=document.createElement(`canvas`);i.width=n,i.height=r;let a=i.getContext?i.getContext(`2d`):null,o=new js(i);o.colorSpace=oe,o.anisotropy=4;let s=new lr(new Lr(e,t),new jn({map:o,transparent:!0,depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1}));s.renderOrder=20,s.frustumCulled=!1;let c={mesh:s,canvas:i,ctx:a,tex:o,text:``,w:n,h:r,draw(e,t){c.text=e,a&&(a.clearRect(0,0,n,r),t(a,n,r),o.needsUpdate=!0)},dispose(){s.geometry.dispose(),s.material.dispose(),o.dispose()}};return c}var gp=(e,t,n,r,i,a)=>{e.beginPath(),e.roundRect(2,2,t-4,n-4,r),e.fillStyle=i,e.fill(),a&&(e.lineWidth=3,e.strokeStyle=a,e.stroke())},_p=`"Inter Variable", "Inter", system-ui, "Segoe UI", sans-serif`;async function vp(e=navigator.xr){let t=X&&X.V;if(Z||!t||!t.open||t.drive||!t.sides.length||!t.runs||!e)return!1;let n=await e.requestSession(`immersive-vr`,{optionalFeatures:[`local-floor`,`bounded-floor`]}),r=!0;try{await n.requestReferenceSpace(`local-floor`)}catch{r=!1}let i=t.renderer;Z={session:n,floor:r,saved:{exag:t.exag},side:up(X.startSide(),0,t.sides.length-1),mode:`stand`,last:performance.now(),panelT:0,force:!0,hands:{},prev:{},held:!1,aim:!1,hover:null,objs:[]},t.vr=Z,cancelAnimationFrame(t.raf);{let e=document.getElementById&&document.getElementById(`driveChooser`);e&&e.classList.add(`hidden`)}Z.root=X.slot()&&X.slot().closest(`.rsim`),Z.root&&Z.root.classList.add(`in-vr`);let a=i.domElement;Z.canvasHome=a&&a.parentNode?{cv:a,parent:a.parentNode,next:a.nextSibling}:null;try{t.exag!==1&&X.setExag(1),Cp(t,i),i.setScissorTest(!1),i.xr.enabled=!0,i.xr.setReferenceSpaceType(r?`local-floor`:`local`),i.xr.setFoveation&&i.xr.setFoveation(1),n.addEventListener(`end`,bp),await i.xr.setSession(n)}catch(e){n.removeEventListener&&n.removeEventListener(`end`,bp),xp();try{await n.end()}catch{}throw e}let o=Cd();return t.sides.forEach(e=>X.setShadowSize(e.sun,o.shadow)),Pp(Z.side,!0),lp.get(op)?Z.card.mesh.visible=!1:Yp(),Sp(!0),i.setAnimationLoop(tm),!0}async function yp(){if(Z)try{await Z.session.end()}catch{bp()}}function bp(){Z&&xp()}function xp(){let e=X.V,t=e.renderer,n=Z;Z=null,e.vr=null;try{t.setAnimationLoop(null)}catch{}t.xr.enabled=!1,n.session.removeEventListener&&n.session.removeEventListener(`end`,bp);for(let e of n.objs)e.parent&&e.parent.remove(e);n.panel&&n.panel.dispose(),n.label&&n.label.dispose(),n.menu&&n.menu.dispose(),n.card&&n.card.dispose(),n.disposables.forEach(e=>e.dispose()),e.exag!==n.saved.exag&&X.setExag(n.saved.exag),n.root&&n.root.classList.remove(`in-vr`);let r=()=>{let e=n.canvasHome;e&&e.parent.isConnected&&(e.cv.parentNode!==e.parent||e.cv.nextSibling!==e.next)&&(e.parent.insertBefore(e.cv,e.next&&e.next.parentNode===e.parent?e.next:null),X.resume())};r(),setTimeout(r,60),Sp(!1),X.resume()}function Sp(e){let t=X.slot()&&X.slot().closest(`#site`);if(!t)return;let n=t.querySelector(`#vrNote`),r=document.body&&document.getElementById(`vrPill`);e?(n||t.insertAdjacentHTML(`beforeend`,`<div id="vrNote" class="vr-cover" aria-hidden="true"></div>`),document.body&&!r&&(document.body.insertAdjacentHTML(`beforeend`,`<div id="vrPill" class="vr-pill" role="status"><span>Viewing in VR</span><button type="button" id="vrExit">Exit VR</button></div>`),document.getElementById(`vrExit`).onclick=()=>yp())):(n&&n.remove(),r&&r.remove())}function Cp(e,t){let n=new Ao,r=new Sr(70,1,.05,6e4);n.add(r),n.name=`vrRig`;let i=new Ao;i.name=`vrHud`;let a=[],o=e=>{let t=new jn({fog:!1,toneMapped:!1,...e});return a.push(t),t},s=e=>(a.push(e),e);for(let e=0;e<2;e++){let r=t.xr.getController(e),i=t.xr.getControllerGrip(e),c=new ys(s(new Gn().setFromPoints([new H(0,0,0),new H(0,0,-1)])),new ps({color:16777215,transparent:!0,opacity:.6,fog:!1}));a.push(c.material),c.scale.z=.3,c.visible=!1,r.add(c);let l=new lr(s(new fr(.04,.03,.11)),o({color:2831944}));i.add(l);let u={ctrl:r,grip:i,ray:c,body:l,hand:null,src:null},d=e=>{u.src=e.data,u.hand=e.data&&e.data.handedness,u.hand&&Z&&(Z.hands[u.hand]=u),c.visible=u.hand===`right`,u.hand===`left`&&Z&&i.add(Z.menu.mesh)},f=()=>{Z&&u.hand&&Z.hands[u.hand]===u&&delete Z.hands[u.hand],u.src=null};r.addEventListener(`connected`,d),r.addEventListener(`disconnected`,f),a.push({dispose(){r.removeEventListener(`connected`,d),r.removeEventListener(`disconnected`,f),c.removeFromParent(),l.removeFromParent()}}),n.add(r,i)}let c=new ys(s(new Gn().setAttribute(`position`,new Pn(new Float32Array(144),3))),new ps({color:3003583,fog:!1}));a.push(c.material),c.visible=!1,c.frustumCulled=!1,i.add(c);let l=new lr(s(new Is(.28,.4,40)),o({color:3003583,side:2,transparent:!0,opacity:.85,depthTest:!1}));l.rotation.x=-Math.PI/2,l.visible=!1,l.renderOrder=15,i.add(l);let u=hp(1.9,.24,1216,154);i.add(u.mesh);let d=hp(.9,.78,600,520);i.add(d.mesh);let f=hp(.15,.21,300,420);f.mesh.position.set(0,.06,.06),f.mesh.rotation.x=-Math.PI/3,f.mesh.renderOrder=25;let p=hp(1.3,.86,1040,688);i.add(p.mesh),p.mesh.visible=!1;let m=new Ao;m.visible=!1,i.add(m);let h=s(new Is(.75,1,32)),g=[];for(let e=0;e<8;e++){let e=o({color:4906624,side:2,transparent:!0,opacity:.9,depthTest:!1});g.push(e);let t=new lr(h,e);t.rotation.x=-Math.PI/2,t.renderOrder=14,t.visible=!1,m.add(t)}Object.assign(Z,{rig:n,cam:r,hud:i,arc:c,ring:l,label:u,panel:d,menu:f,card:p,rings:m,ringMats:g,disposables:a,raycaster:new Uc}),Z.objs.push(n,i,f.mesh),Jp()}var wp=e=>X.V.sides[e],Tp=e=>X.V.runs&&X.V.runs.A[e],Ep=e=>{let t=Tp(e);return t?up(Math.round(X.V.u*(t.n-1)),0,t.n-1):0};function Dp(e){let t=Tp(e),n=Ep(e),r=t?t.psi[n]:0;return{fx:Math.cos(r),fz:Math.sin(r),psi:r}}var Op=(e,t)=>Math.atan2(-e,-t),kp=(e,t,n)=>mu(wp(e).patch,t,n)*X.V.exag;function Ap(e){return Z.cam.updateMatrixWorld(!0),e.setFromMatrixPosition(Z.cam.matrixWorld)}function jp(e){let t=Z.cam.position,n=Math.cos(e),r=Math.sin(e);return{x:t.x*n+t.z*r,z:-t.x*r+t.z*n}}function Mp(e,t,n,r){Z.rig.rotation.set(0,r,0);let i=jp(r);Z.rig.position.set(t-i.x,kp(e,t,n)+(Z.floor?0:1.6),n-i.z)}function Np(e){let t=Tp(e),n=wp(e),r=n.patch.size/2;if(!t)return;let i=Ep(e),a=t.s[i]+25,o=i;for(;o<t.n-1&&t.s[o]<a;)o++;let s=t.psi[o],c=Math.cos(s),l=Math.sin(s),u=t.x[o]-r+l*6,d=t.z[o]-r-c*6,f=n.rover?n.rover.root.position:dp.set(t.x[i]-r,0,t.z[i]-r);Mp(e,u,d,Op(f.x-u,f.z-d))}function Pp(e,t){let n=X.V,r=wp(e);if(!t&&Z.side!==e){let t=wp(Z.side),n=Dp(Z.side),i=Ap(fp),a=t.rover.root.position,o=i.x-a.x,s=i.z-a.z,c=o*n.fx+s*n.fz,l=o*n.fz-s*n.fx,u=Z.rig.rotation.y-Op(n.fx,n.fz);Z.side=e;let d=Dp(e),f=r.rover.root.position;Mp(e,f.x+c*d.fx+l*d.fz,f.z+c*d.fz-l*d.fx,u+Op(d.fx,d.fz))}Z.side=e,r.scene.add(Z.rig),r.scene.add(Z.hud),n.sides.forEach(e=>{e.marker.visible=!1}),t&&(Z.mode===`stand`?Np(e):Lp(e,!0)),Z.force=!0,Z.panelT=0,Vp(),Wp(),Jp()}function Fp(){X.V.sides.length<2?Up(`Only one ground is open`):Pp(1-Z.side,!1)}function Ip(){Z.mode=Z.mode===`stand`?`follow`:`stand`,Z.mode===`stand`?Np(Z.side):Lp(Z.side,!0),Vp(),Wp(),Jp()}function Lp(e,t,n=.016){let r=wp(e);if(!r.rover)return;let i=Dp(e),a=r.rover.root.position,o=a.x-i.fx*7+i.fz*3,s=a.z-i.fz*7-i.fx*3;if(t){Mp(e,o,s,Op(i.fx,i.fz));return}let c=jp(Z.rig.rotation.y),l=1-Math.exp(-n*2.2),u=o-c.x,d=s-c.z;Z.rig.position.x+=(u-Z.rig.position.x)*l,Z.rig.position.z+=(d-Z.rig.position.z)*l;let f=kp(e,Z.rig.position.x+c.x,Z.rig.position.z+c.z)+(Z.floor?0:1.6);Z.rig.position.y+=(f-Z.rig.position.y)*Math.min(1,l*2)}function Rp(e){let t=Ap(fp).clone(),n=Z.rig.rotation.y+e*Math.PI/180;Z.rig.rotation.y=n;let r=jp(n);Z.rig.position.x=t.x-r.x,Z.rig.position.z=t.z-r.z}function zp(e){let t=X.V,n=ap.indexOf(t.speed);n<0&&(n=1),n=up(n+e,0,ap.length-1),X.setSpeed(ap[n]),Jp(),Z.panelT=0}function Bp(e){return X.title(wp(e))}function Vp(e){let t=Bp(Z.side),n=Z.mode===`stand`?`Standing on site`:`Following the rover`,r=e||`${n} · Y: switch ground · X: view`,i=wp(Z.side).key;Z.label.draw(t,(e,n,a)=>{gp(e,n,a,28,`rgba(8,12,19,0.82)`,i===`target`?`#38bdf8`:`#fb923c`),e.fillStyle=i===`target`?`#7dd3fc`:`#fdba74`,e.font=`700 54px ${_p}`,e.textBaseline=`middle`,e.fillText(t,36,a*.38,n-72),e.fillStyle=`#9aaabf`,e.font=`400 34px ${_p}`,e.fillText(r,36,a*.76,n-72)})}var Hp=0;function Up(e){Vp(e),clearTimeout(Hp),Hp=setTimeout(()=>{Z&&Vp()},1800)}function Wp(){let e=Ap(fp),t=Z.rig.rotation.y+Gp(),n=-Math.sin(t),r=-Math.cos(t);Z.label.mesh.position.set(e.x+n*3,e.y+.55,e.z+r*3),Z.label.mesh.rotation.set(0,t,0)}function Gp(){return pp.copy(Z.cam.quaternion),new Yt().setFromQuaternion(pp,`YXZ`).y}var Kp=(e,t)=>Number.isFinite(e)?e.toFixed(t):`-`;function qp(){let e=X.V,t=Z.side,n=Tp(t);if(!n)return;let r=Ep(t),i=!!(n.blocked&&n.blocked[r]),a=n.v[r],o=[[`Speed`,e.playing?`${Kp(a*100,1)} cm/s`:`paused`],[`Slope under the rover`,`${Kp(n.tilt[r],1)}°`],[`Average wheel slip`,`${Kp(n.slip[r],0)} %`],[`Sinkage`,`${Kp(n.sink?n.sink[r]*1e3:NaN,1)} mm`],[`Body pitch, roll`,`${Kp(n.pitch[r],1)}°, ${Kp(n.roll[r],1)}°`],[`Energy used`,`${Kp(n.E[r]/3600,1)} Wh`],[`Distance, time`,`${Kp(n.s[r],0)} m, ${Kp(n.t[r]/60,1)} min`]],s=`${wp(t).key===`target`&&!wp(t).same?sp[wp(t).body]+` ground`:`Earth ground`} · ${e.speed}x`,c=[s,...o.map(e=>e.join(`: `)),i?`STUCK`:``].join(`
`);Z.panel.draw(c,(e,n,r)=>{gp(e,n,r,26,`rgba(8,12,19,0.86)`,i?`#f87171`:`#2f4260`),e.textBaseline=`middle`,e.fillStyle=wp(t).key===`target`?`#7dd3fc`:`#fdba74`,e.font=`700 34px ${_p}`,e.fillText(s,28,40,n-56),o.forEach(([t,r],i)=>{let a=96+i*52;e.fillStyle=`#9aaabf`,e.font=`400 28px ${_p}`,e.fillText(t,28,a,n*.56),e.fillStyle=`#e8eef7`,e.font=`600 30px ${_p}`,e.textAlign=`right`,e.fillText(r,n-28,a),e.textAlign=`left`}),i&&(e.fillStyle=`#f87171`,e.fillRect(28,r-70,n-56,50),e.fillStyle=`#1a0606`,e.font=`800 34px ${_p}`,e.textAlign=`center`,e.fillText(`STUCK`,n/2,r-45),e.textAlign=`left`)})}function Jp(){if(!Z)return;let e=X.V,t={play:e.playing?`Pause`:`Play`,restart:`Restart`,mode:Z.mode===`stand`?`View: stand`:`View: follow`,side:e.sides.length>1?`Show ${wp(1-Z.side).key===`target`&&!wp(1-Z.side).same?sp[wp(1-Z.side).body]:`Earth`}`:`One ground`,speed:`Speed ${e.speed}x`,rings:Z.rings.visible?`Slip rings: on`:`Slip rings: off`,exit:`Exit VR`};Z.menu.draw(cp.map(([e])=>t[e]).join(`
`),(e,n,r)=>{gp(e,n,r,22,`rgba(8,12,19,0.9)`,`#2f4260`);let i=(r-16)/cp.length;cp.forEach(([r],a)=>{let o=8+a*i;Z.hover===r&&(e.fillStyle=`rgba(45,212,191,0.28)`,e.fillRect(8,o+3,n-16,i-6)),e.fillStyle=r===`exit`?`#fca5a5`:`#e8eef7`,e.font=`600 30px ${_p}`,e.textBaseline=`middle`,e.fillText(t[r],22,o+i/2,n-44)})})}function Yp(){let e=[`Controls`,`Right trigger: teleport, or click the wrist menu`,`A: play / pause     B: restart`,`Right stick left / right: speed     click: turn 30°`,`X: stand on site / follow the rover`,`Y: switch Mars or Moon ground / Earth ground`,`Wrist menu: on the left controller`,`Pull the trigger to close`];Z.card.draw(e.join(`
`),(t,n,r)=>{gp(t,n,r,30,`rgba(8,12,19,0.92)`,`#2dd4bf`),t.textBaseline=`middle`,t.fillStyle=`#e8eef7`,t.font=`700 52px ${_p}`,t.fillText(e[0],44,66),e.slice(1,-1).forEach((e,r)=>{t.fillStyle=`#cbd5e1`,t.font=`400 36px ${_p}`,t.fillText(e,44,150+r*72,n-88)}),t.fillStyle=`#2dd4bf`,t.font=`600 34px ${_p}`,t.fillText(e[e.length-1],44,r-50)});let t=Ap(fp),n=Z.rig.rotation.y+Gp();Z.card.mesh.position.set(t.x-Math.sin(n)*2,t.y-.1,t.z-Math.cos(n)*2),Z.card.mesh.rotation.set(0,n,0),Z.card.mesh.visible=!0}function Xp(){Z.card.mesh.visible=!1,lp.set(op,`1`)}function Zp(e){if(e===`play`)X.togglePlay();else if(e===`restart`)X.restart();else if(e===`mode`)Ip();else if(e===`side`)Fp();else if(e===`speed`){let e=X.V,t=ap.indexOf(e.speed);X.setSpeed(ap[(t+1)%ap.length])}else if(e===`rings`)Z.rings.visible=!Z.rings.visible;else if(e===`exit`){yp();return}Z&&(Jp(),Z.panelT=0)}function Qp(){for(let e of[`left`,`right`]){let t=Z.hands[e],n=t&&t.src&&t.src.gamepad;if(!n)continue;let r=Z.prev[e]||[],i=e=>!!(n.buttons[e]&&n.buttons[e].pressed),a=e=>i(e)&&!r[e];if(e===`right`){i(0)&&!r[0]&&(Z.aim=!0),!i(0)&&r[0]&&$p(),a(4)&&(X.togglePlay(),Jp(),Z.panelT=0),a(5)&&(X.restart(),Jp()),a(3)&&Rp(-30);let e=n.axes.length>2?n.axes[2]:n.axes[0]||0;!Z.held&&Math.abs(e)>.7?(Z.held=!0,zp(e>0?1:-1)):Math.abs(e)<.3&&(Z.held=!1)}else a(4)&&Ip(),a(5)&&Fp();Z.card.mesh.visible&&(a(4)||a(5))&&Xp(),Z.prev[e]=n.buttons.map(e=>e.pressed)}}function $p(){if(Z.aim=!1,Z.arc.visible=!1,Z.ring.visible=!1,Z.hover)Zp(Z.hover);else if(Z.card.mesh.visible)Xp();else if(Z.landing){let e=Z.rig.rotation.y,t=jp(e);Z.rig.position.set(Z.landing.x-t.x,Z.landing.y+(Z.floor?0:1.6),Z.landing.z-t.z),Z.mode===`follow`&&(Z.mode=`stand`,Vp(),Jp()),Z.force=!0}}function em(){let e=Z.hands.right;if(Z.hover=null,Z.landing=null,!e){Z.arc.visible=Z.ring.visible=!1;return}e.ctrl.updateMatrixWorld(!0);let t=dp.setFromMatrixPosition(e.ctrl.matrixWorld),n=fp.set(0,0,-1).applyQuaternion(e.ctrl.getWorldQuaternion(pp)).normalize();Z.raycaster.set(t,n);let r=[Z.menu.mesh.parent?Z.menu.mesh:null].filter(Boolean),i=r.length?Z.raycaster.intersectObjects(r,!1):[],a=Z.hover;if(i.length&&i[0].uv){let t=up(Math.floor((1-i[0].uv.y)*cp.length),0,cp.length-1);Z.hover=cp[t][0],e.ray.scale.z=i[0].distance}else e.ray.scale.z=.3;if(Z.hover!==a&&Jp(),!Z.aim||Z.hover){Z.arc.visible=Z.ring.visible=!1;return}let o=Z.arc.geometry.attributes.position,s=o.count,c=Z.side,l=null,u=0;for(let e=0;e<s;e++){let r=e*.05,i=t.x+n.x*9*r,a=t.y+n.y*9*r-4.9*r*r,s=t.z+n.z*9*r;o.setXYZ(e,i,a,s),u=e+1;let d=kp(c,i,s);if(a<=d){o.setXYZ(e,i,d,s),l={x:i,y:d,z:s};break}}o.needsUpdate=!0,Z.arc.geometry.setDrawRange(0,u),Z.arc.visible=!0,l?(Z.landing=l,Z.ring.position.set(l.x,l.y+.03,l.z),Z.ring.visible=!0):Z.ring.visible=!1}function tm(){if(!Z)return;let e=X.V,t=performance.now(),n=Math.min(.1,(t-Z.last)/1e3);Z.last=t;let r=e.playing;if(X.advancePlayback(n,t),r!==e.playing&&Jp(),Qp(),!Z)return;Z.mode===`follow`&&Lp(Z.side,!1,n),em();let i=wp(Z.side),a=Ap(fp);if(i.rover){let e=i.focus||=[[0,0]];e[0][0]=i.rover.root.position.x,e[0][1]=i.rover.root.position.z}if(i.ground.update(a,Z.force,i.rover?i.focus:null),Z.force=!1,i.rover&&i.ground.rocks&&i.ground.rocks.update(i.rover.root.position.x,i.rover.root.position.z),i.sky.position.copy(a),i.rover&&e.sunV){let t=i.rover.root.position,n=45*Cd().ext/.5,r=i.sun.shadow.camera;i.sun.target.position.copy(t),i.sun.position.copy(t).addScaledVector(e.sunV,i.patch.size*1.6),Math.abs(r.right-n)>n*.05&&(r.left=-n,r.right=n,r.top=n,r.bottom=-n,r.near=1,r.far=i.patch.size*4,r.updateProjectionMatrix(),i.sun.shadow.normalBias=n*.0025)}if(i.rover){let e=i.rover.root.position,n=Dp(Z.side);Z.panel.mesh.position.set(e.x-n.fz*2.2,e.y+2.6,e.z+n.fx*2.2),Z.panel.mesh.rotation.set(0,Math.atan2(a.x-Z.panel.mesh.position.x,a.z-Z.panel.mesh.position.z),0),t-Z.panelT>100&&(Z.panelT=t,qp()),nm(i)}Z.label.mesh.rotation.y=Math.atan2(a.x-Z.label.mesh.position.x,a.z-Z.label.mesh.position.z),e.renderer.render(i.scene,Z.cam)}function nm(e){if(!Z.rings.visible)return;let t=Tp(Z.side),n=t?t.slip[Ep(Z.side)]:0,r=new W().setHSL(up(.33*(1-n/30),0,.33),.85,.5),i=Y.cfg&&Y.cfg.wheel_radius_m||.26,a=e.rover.wheels||[];Z.rings.children.forEach((e,t)=>{let n=a[t];e.visible=!!n,n&&(n.node.getWorldPosition(e.position),e.position.y-=i*.92,e.scale.setScalar(i*1.15),Z.ringMats[t].color.copy(r))})}var Q=e=>document.getElementById(e),rm=`#38bdf8`,im=`#fb923c`,am=()=>({timing:{},awake:0,notes:[],gl:!1,ready:!1,open:!1,sides:[],cams:[],ctx:null,mode:`plain`,exag:1,tex:null,runs:null,routes:null,u:0,playing:!1,speed:1,DUR:75,link:!0,follow:!0,active:0,dirty:-1,syncing:!1,shown:!1,off:[]}),$=am(),om={get V(){return $}},sm=new H,cm=new H,lm=(e,t,n)=>Math.max(t,Math.min(n,e)),um=e=>String(e).replace(/[&<>"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`})[e]),dm=(e,t,n,r)=>{e.addEventListener(t,n,r),$.off.push(()=>e.removeEventListener(t,n,r))},fm=(e=1500)=>{$.awake=Math.max($.awake,performance.now()+e)},pm=e=>e&&e.message||(e&&e.target&&(e.target.src||e.target.currentSrc)?`could not fetch ${e.target.src||e.target.currentSrc}`:String(e));function mm(e){$.notes.push(e);let t=Q(`siteNote`);t&&(t.innerHTML=$.notes.map(e=>`<div>${um(e)}</div>`).join(``),t.classList.remove(`hidden`))}function hm(e,t,n){let r=`Could not load ${t}: ${pm(n)}`;console.error(r,n);let i=typeof e==`string`?Q(e):e;i&&(i.innerHTML=i.tagName===`TABLE`?`<tr><td class="load-fail">${um(r)}</td></tr>`:`<span class="load-fail">${um(r)}</span>`),mm(r)}var gm=(e,t)=>{$.timing[e]=($.timing[e]||0)+performance.now()-t};function _m(e,t,n){let r=performance.now();try{return n()}catch(n){hm(t,e,n);return}finally{gm(e,r)}}async function vm(e,t,n){let r=performance.now();try{return await n()}catch(n){hm(t,e,n);return}finally{gm(e,r)}}var ym=`
<div id="site" class="site">
  <div class="site-top">
    <button id="siteBack" class="btn ghost" aria-label="Back to the globe">&larr; Back to globe</button>
    <div id="siteTitle" class="site-title"></div>
    <span id="vrSlot" class="vr-slot"></span>
    <div class="gfx-wrap"><button id="gfxBtn" class="btn ghost small" aria-expanded="false" aria-controls="gfxPop">Graphics</button><div id="gfxPop" class="gfx-pop hidden" role="dialog" aria-label="Graphics quality"></div></div>
  </div>
  <div id="siteNote" class="site-note hidden" role="alert"></div>
  <div class="site-body">
    <div class="vp-wrap" id="vpWrap">
      <div class="vp-stage" id="vpStage">
        <canvas id="siteCanvas"></canvas>
        <div class="pane left" id="paneL" tabindex="0" role="application" aria-label="Ground view. Drag to orbit, scroll to zoom, arrow keys to move."></div>
        <div class="pane right" id="paneR" tabindex="0" role="application" aria-label="Same ground at the other gravity. Drag to orbit, scroll to zoom, arrow keys to move."></div>
        <div class="vp-divider" id="vpDivider"></div>
        <div class="vp-label left" id="vpLeft"></div>
        <div class="vp-label right" id="vpRight"></div>
        <div class="rhud left" id="hudL"></div>
        <div class="rhud right" id="hudR"></div>
        <div class="live-cmp" id="liveCmp" aria-label="Live comparison, left pane and right pane"></div>
        <div class="vp-verdict hidden" id="vpVerdict" role="status">
          <div id="vpVerdictBody" class="vv-body"></div>
          <div class="vv-actions"><button id="vpVerdictMore" class="btn ghost small">Details</button><button id="vpVerdictClose" class="btn ghost small" aria-label="Close verdict">Close</button></div>
        </div>
        <div id="driveUI" class="drive-ui hidden" aria-label="Drive mode">
          <div id="dvStage" class="dv-stage" tabindex="-1"></div>
          <div class="dv-top" id="dvTop"></div>
          <div class="dv-banner hidden" id="dvBanner" role="status" aria-live="polite"></div>
          <aside class="dv-hud" id="dvHud" aria-label="Instrument panel"></aside>
          <div class="dv-pip hidden" id="dvPip" aria-label="Comparison view, same inputs at the other gravity"><span class="dv-pip-label" id="dvPipLabel"></span></div>
          <div class="dv-hint" id="dvHint"><kbd>H</kbd> controls</div>
          <div class="dv-sheet hidden" id="dvSheet" role="dialog" aria-label="Controls"></div>
          <footer class="dv-foot" id="dvFoot"></footer>
        </div>
        <div id="dvFade" class="dv-fade" aria-hidden="true"></div>
      </div>
      <div class="vp-bars">
        <div class="play-row">
          <button id="playBtn" class="primary play" aria-label="Play"><svg class="ic-play" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 1l9 5-9 5z" fill="currentColor"/></svg><svg class="ic-pause" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor"/></svg><span class="lbl">Play</span></button>
          <button id="restartBtn" class="btn ghost" aria-label="Restart simulation">Restart</button>
          <button id="driveBtn" class="btn drive-btn" aria-label="Drive a rover yourself with a game controller or the keyboard"><svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M5 5.5h6a3.5 3.5 0 0 1 3.4 4.3l-.5 2a1.6 1.6 0 0 1-2.7.7L10 11H6l-2.2 1.5a1.6 1.6 0 0 1-2.7-.7l-.5-2A3.5 3.5 0 0 1 5 5.5z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M5 7.4v2.2M3.9 8.5h2.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="10.8" cy="7.6" r=".8" fill="currentColor"/><circle cx="12.4" cy="9" r=".8" fill="currentColor"/></svg><span>Drive</span></button>
          <div class="seg small" id="speeds" role="group" aria-label="Playback speed"></div>
          <input id="scrub" class="scrub" type="range" min="0" max="1000" value="0" aria-label="Simulation timeline">
          <output id="scrubO" class="scrub-o">0 %</output>
        </div>
        <div class="tool-row">
          <div class="seg small" id="colorModes" role="group" aria-label="Ground colouring"></div>
          <label>Vertical x<input id="exag" type="range" min="1" max="5" step="0.5" value="1"><output id="exagO">1</output></label>
          <label>Sun elevation<input id="sunEl" type="range" min="3" max="80" step="1" value="35"><output id="sunElO">35</output></label>
          <label>Sun azimuth<input id="sunAz" type="range" min="0" max="360" step="5" value="135"><output id="sunAzO">135</output>${r(`The compass direction the sunlight comes from. 0 is north and 90 is east.`,`About sun azimuth`)}</label>
          <label class="chk"><input id="follow" type="checkbox" checked> Follow rover</label>
          <label class="chk" id="linkWrap"><input id="link" type="checkbox" checked> Link views</label>
          <button id="resetCam" class="btn ghost small" aria-label="Reset camera">Reset view</button>
          <span id="viewInfo"></span>
        </div>
      </div>
    </div>
    <aside class="site-side" id="siteSide" aria-label="Ground and simulation details">
      <div class="panel-head"><button id="collapseSide" class="icon-btn side-toggle" type="button" aria-controls="siteSideBody" aria-expanded="true" aria-label="Close the details panel"><svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M4 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span class="ph-title">Ground and simulation details</span>${r(`This is a quick estimate, not an exact rover simulation. The soil is kept simple, so treat the results as a first check.`,`About this simulation`)}</div>
      <div class="panel-body" id="siteSideBody">
      <section id="simScore" class="sim-score hidden" aria-live="polite"></section>
      <section>
        <h3>This ground ${r(`Heights come from satellite elevation data, with points about 30 m apart. Smaller bumps are filled in smoothly by the app.`,`About this ground`)}</h3>
        <table id="cmpTable" class="cmp gr-table"></table>
      </section>
      <section id="tgtSec" class="hidden">
        <h3><span id="tgtHead">Target ground</span> ${r(`The Mars or Moon ground the rover is compared on, from orbital elevation maps. Its soil is a simple estimate for that type of ground.`,`About the target ground`)}</h3>
        <table id="tgtTable" class="cmp gr-table"></table>
      </section>
      <section>
        <h3>Soil inputs ${r(`These are estimates for this type of ground, based on its rock and rainfall. They are not measured here. You can change the friction below.`,`About the soil inputs`)}</h3>
        <table id="soilTable" class="cmp gr-table"></table>
      </section>
      <section id="simSec">
        <h3>Rover simulation ${r(`The same rover drives from start to goal on each ground. By default the left view is the real Mars or Moon ground and the right view is this Earth place. You can also show this Earth place at two gravities.`,`About the rover simulation`)}</h3>
        <div id="roverBar" class="rover-bar"></div>
        <div class="sim-inputs" id="simInputs"></div>
        <div id="simStatus" class="hint"></div>
        <div id="charts" class="charts"></div>
        <div id="verdict" class="verdict hidden"></div>
      </section>
      <footer id="siteCredits" class="site-credits"></footer>
      </div>
    </aside>
  </div>
</div>
<div id="driveChooser" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="dcTitle">
  <div class="modal-card dc-card">
    <button id="dcClose" class="btn ghost close" aria-label="Close">Close</button>
    <h1 id="dcTitle">Drive a rover ${r(`Drive the rover yourself on this ground. There is no goal and no score. With two sides open, the instrument panel compares your rover with the same moves on the other side.`,`About drive mode`)}</h1>
    <div id="dcRover" class="dc-rover"></div>
    <div class="dc-cards" id="dcCards"></div>
    <p class="hint dc-note">Controller or keyboard ${r(`Use a PlayStation 5 controller or any standard gamepad (USB-C or Bluetooth), then press a button. On the keyboard, W A S D drives and Space brakes.`,`About the controls`)}</p>
  </div>
</div>`,bm=null;function xm(){if($.ready)return;let e=Q(`siteCanvas`);bm?e.replaceWith(bm.canvas):(bm={renderer:new Io({canvas:e,antialias:wd(),powerPreference:`high-performance`}),canvas:e},window.__rsimGL=()=>({...bm.renderer.info.memory,programs:bm.renderer.info.programs.length,size:[bm.canvas.width,bm.canvas.height],attached:bm.canvas.isConnected})),bm.canvas,$.renderer=bm.renderer,$.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,Sd().dpr)),$.renderer.setScissorTest(!0),$.renderer.shadowMap.enabled=!0,$.renderer.shadowMap.type=2,$.renderer.toneMapping=4,$.renderer.toneMappingExposure=.95,[`paneL`,`paneR`].forEach((e,t)=>{let n=new Sr(50,1,.5,6e4),r=Q(e),i=new $c(n,r);Object.assign(i,{enableDamping:!0,dampingFactor:.08,maxPolarAngle:Math.PI*.49,minDistance:4,maxDistance:4e3,zoomSpeed:.9,screenSpacePanning:!1}),i.listenToKeyEvents(r),i.addEventListener(`start`,()=>{$.active=t}),i.addEventListener(`change`,()=>{$.syncing||($.dirty=t),fm()}),$.cams.push({camera:n,controls:i,el:r,anim:null})}),$.ro=new ResizeObserver(Mm),$.ro.observe(Q(`vpStage`)),[`pointerdown`,`pointermove`,`wheel`,`keydown`,`input`,`change`,`click`].forEach(e=>dm(Q(`site`),e,t=>{(e!==`pointermove`||t.buttons)&&fm()},{capture:!0,passive:!0})),dm(document,`visibilitychange`,()=>{document.hidden||fm()});let t=[[`plain`,`Natural`],[`slope`,`Slope`],[`elev`,`Elevation`]];Q(`colorModes`).innerHTML=``,t.forEach(([e,t])=>{let n=document.createElement(`button`);n.textContent=t,n.dataset.mode=e,n.onclick=()=>{$.mode=e,Am(),Um()},Q(`colorModes`).appendChild(n)}),Q(`speeds`).innerHTML=``,[.5,1,2,4].forEach(e=>{let t=document.createElement(`button`);t.textContent=e+`x`,t.dataset.speed=e,t.setAttribute(`aria-label`,`Playback speed ${e} times`),t.onclick=()=>{$.speed=e,jm()},Q(`speeds`).appendChild(t)});let n=(e,t)=>{let n=Q(e),r=Q(e+`O`);n.oninput=()=>{r&&(r.textContent=n.value),t(+n.value)}},r=0;n(`exag`,e=>{$.exag=e,clearTimeout(r),r=setTimeout(()=>{$.sides.forEach(Wm),zh(!0)},60)}),n(`sunEl`,Pm),n(`sunAz`,Pm),Q(`follow`).onchange=()=>{$.follow=Q(`follow`).checked,$.follow&&$.runs&&Dh(!0)},Q(`link`).onchange=()=>{$.link=Q(`link`).checked},Q(`resetCam`).onclick=()=>Dh($.follow&&!!$.runs),Q(`siteBack`).onclick=()=>$.onBack?$.onBack():dh(),Q(`playBtn`).onclick=Eh,Q(`driveBtn`).onclick=()=>i(()=>import(`./drivemode-DPM-dv4F.js`).then(e=>e.openChooser(om.V)),__vite__mapDeps([0,1,2])),Q(`restartBtn`).onclick=()=>{$.u=0,$.snap=!0,$.shown=!1,Th(!0)},Q(`scrub`).oninput=()=>{$.u=Q(`scrub`).value/1e3,$.snap=!0},Q(`vpVerdictClose`).onclick=()=>Q(`vpVerdict`).classList.add(`hidden`),Q(`vpVerdictMore`).onclick=()=>{let e=Cm();e&&Tm(!1),setTimeout(()=>Q(`verdict`).scrollIntoView({block:`nearest`,behavior:`smooth`}),e?320*Ld.scale+30:0)},Q(`collapseSide`).onclick=()=>Tm(!Cm()),$.ready=!0,$.wake=fm,Td($.renderer,Em),Md(Q(`gfxPop`));{let e=Q(`gfxBtn`),t=Q(`gfxPop`),n=n=>{t.classList.toggle(`hidden`,!n),e.setAttribute(`aria-expanded`,n?`true`:`false`)};e.onclick=e=>{e.stopPropagation(),n(t.classList.contains(`hidden`))};let r=r=>{!t.contains(r.target)&&r.target!==e&&n(!1)};document.addEventListener(`click`,r),$.off.push(()=>document.removeEventListener(`click`,r))}}var Sm=`rsim.side.closed`,Cm=()=>!!Q(`site`)&&Q(`site`).classList.contains(`s-col`);function wm(){try{return localStorage.getItem(Sm)===`1`}catch{return!1}}function Tm(e,t=!0){let n=Q(`site`),r=Q(`collapseSide`);if(n&&r){if(n.classList.toggle(`s-col`,e),r.setAttribute(`aria-expanded`,e?`false`:`true`),r.setAttribute(`aria-label`,e?`Open the details panel`:`Close the details panel`),r.title=e?`Open the details panel`:`Close the details panel`,e&&Q(`siteSideBody`).contains(document.activeElement)&&r.focus(),t)try{localStorage.setItem(Sm,e?`1`:`0`)}catch{}fm(1200)}}function Em(e){$.q=e;let t=new URLSearchParams(location.search).has(`hq`);$.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,t?2:e.dpr)),Mm(),$.sides.forEach(Om),fm(800)}function Dm(e,t){e.shadow.mapSize.x!==t&&(e.shadow.mapSize.set(t,t),e.shadow.map&&(e.shadow.map.dispose(),e.shadow.map=null))}function Om(e){let t=$.q||Sd();Dm(e.sun,$.drive?t.shadowDrive:t.shadow),e.ground.k=+new URLSearchParams(location.search).get(`lod`)||t.lod,e.ground.lodDirty=!0,e.ground.ctx.forEach(e=>{let n=e.userData.ring;e.visible=n==null||n<=t.ring});let n=e.mat.userData.U;n.uSimple.value=t.simple,n.uNrmOn.value=t.nrm,e.ctxMat&&e.ctxMat!==e.mat&&e.ctxMat.userData.U&&(e.ctxMat.userData.U.uSimple.value=t.simple,e.ctxMat.userData.U.uNrmOn.value=t.nrm),e.rover&&e.rover.model.traverse(e=>{e.userData.tiny&&(e.visible=!!t.tiny)})}var km={applySide:e=>Om(e),level:()=>$.q||Sd()};function Am(){document.querySelectorAll(`#colorModes button`).forEach(e=>e.classList.toggle(`active`,e.dataset.mode===$.mode))}function jm(){document.querySelectorAll(`#speeds button`).forEach(e=>e.classList.toggle(`active`,+e.dataset.speed===$.speed))}function Mm(){if(!$.ready||!$.renderer)return;let e=Q(`vpStage`).clientWidth,t=Q(`vpStage`).clientHeight;e&&t&&$.renderer.setSize(e,t,!1),fm()}function Nm(){let e=Q(`sunEl`).value*Math.PI/180,t=Q(`sunAz`).value*Math.PI/180;return new H(Math.cos(e)*Math.sin(t),Math.sin(e),-Math.cos(e)*Math.cos(t))}function Pm(){$.sunV=Nm()}function Fm(e){let t=document.createElement(`canvas`);t.width=t.height=8;let n=t.getContext(`2d`);n.drawImage(e,0,0,8,8);let r=n.getImageData(0,0,8,8).data,i=[0,0,0];for(let e=0;e<64;e++)for(let t=0;t<3;t++)i[t]+=r[e*4+t]/255/64;return new H(...i.map(e=>e**2.2))}async function Im(){if($.tex)return $.tex;let e=new pc,t=Math.min(8,$.renderer.capabilities.getMaxAnisotropy()),n=(n,r)=>e.loadAsync(n).then(e=>(e.wrapS=e.wrapT=d,e.anisotropy=t,r&&(e.colorSpace=oe),e)),r=async e=>{let t=`${$l}assets/textures/ground/${e}/${e}_`,[r,i,a]=await Promise.all([n(t+`color_1k.jpg`,!0),n(t+`normal_gl_1k.jpg`,!1),n(t+`roughness_1k.jpg`,!1)]);return{map:r,normal:i,rough:a,avg:Fm(r.image)}};return $.tex={rock:await r(`rocks_ground_02`),sand:await r(`coast_sand_rocks_02`)},$.tex}var Lm={moon:{set:`rock`,tint:[.9,.9,.88],sat:0,scale:5,nrm:1,bright:1.25},mars:{set:`rock`,tint:[1.05,.7,.52],sat:.42,scale:5,nrm:1,bright:1.25},earth:{set:`sand`,tint:[1.1,1.05,.9],sat:1,scale:4,nrm:1,bright:1.45}},Rm={moon:[1,1,.98],mars:[1.28,.9,.68],earth:[1,1,1]},zm={moon:9276810,mars:9067073,earth:9208178};function Bm(e,t,n,r){let i={...Lm[e]},a=t&&t[i.set];e===`earth`&&n&&!r.img&&(n.temp_mean<270?Object.assign(i,{tint:[1.5,1.55,1.65],sat:.15,bright:1.55}):n.dust>.62&&Object.assign(i,{tint:[1.35,1.15,.8],sat:.6}));let o=a?new Rs({map:a.map,normalMap:a.normal,roughnessMap:a.rough,roughness:1,metalness:0,side:2}):new Rs({color:new W().setRGB(...i.tint.map(e=>e*.3)),roughness:1,metalness:0,side:2}),s={uTint:{value:new H(...i.tint).multiplyScalar(i.bright)},uSat:{value:i.sat},uScale:{value:i.scale},uAvg:{value:a?a.avg:new H(.3,.3,.3)},uNrm:{value:i.nrm},uPatch:{value:r.size},uEx:{value:1},uMode:{value:0},uSpan:{value:new B(r.span[0],Math.max(r.span[1],r.span[0]+.001))},uSlopeTex:{value:r.slopeTex},uHasSlope:{value:+!!r.slopeTex},uRange:{value:ud},uSimple:{value:0},uNrmOn:{value:1},uImg:{value:r.img||null},uHasImg:{value:+!!r.img},uImgTint:{value:r.gray?new H(...Rm[e]):new H(1,1,1)}};return o.userData.U=s,o.onBeforeCompile=e=>{Object.assign(e.uniforms,s),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vWPos; uniform float uScale;`).replace(`#include <uv_vertex>`,`#include <uv_vertex>
 vec4 _wp = modelMatrix * vec4(position, 1.0); vWPos = _wp.xyz;
 #ifdef USE_NORMALMAP
 vNormalMapUv = _wp.xz / uScale;
 #endif
 #ifdef USE_MAP
 vMapUv = _wp.xz / uScale;
 #endif
 #ifdef USE_ROUGHNESSMAP
 vRoughnessMapUv = _wp.xz / uScale;
 #endif`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
        varying vec3 vWPos; uniform vec3 uTint; uniform float uSat; uniform float uScale; uniform vec3 uAvg; uniform float uNrm;
        uniform float uPatch; uniform float uEx; uniform int uMode; uniform vec2 uSpan; uniform sampler2D uSlopeTex; uniform float uHasSlope; uniform float uRange; uniform sampler2D uImg; uniform float uHasImg; uniform vec3 uImgTint; uniform float uSimple; uniform float uNrmOn;
        vec3 ramp4(float t, vec3 a, vec3 b, vec3 c, vec3 d, float s1, float s2) { t = clamp(t, 0.0, 1.0); return t < s1 ? mix(a, b, t / s1) : t < s2 ? mix(b, c, (t - s1) / (s2 - s1)) : mix(c, d, (t - s2) / (1.0 - s2)); }`).replace(`#include <map_fragment>`,`
        vec2 puv = vWPos.xz / uPatch + 0.5; float inP = step(0.0, puv.x) * step(puv.x, 1.0) * step(0.0, puv.y) * step(puv.y, 1.0);
        vec2 gH = vec2(0.0); float hasG = uHasSlope * inP;
        if (hasG > 0.5) gH = (texture2D(uSlopeTex, puv).rg * 2.0 - 1.0) * uRange;
        float slopeDeg = degrees(atan(length(gH)));
        vec3 gb = vec3(1.0); float w1x = 0.0;
        #ifdef USE_MAP
        mat2 R1 = mat2(0.8253, -0.5646, 0.5646, 0.8253), R2 = mat2(0.8776, 0.4794, -0.4794, 0.8776);
        vec2 w1 = vWPos.xz / uScale; vec2 w2 = vWPos.xz / (uScale * 0.21) + vec2(0.37, 0.71); vec2 w3 = vWPos.xz / (uScale * 6.3);
        vec2 w4 = (R1 * vWPos.xz) / (uScale * 1.7) + vec2(0.21, 0.55); vec2 w5 = (R2 * vWPos.xz) / (uScale * 0.47);
        if (uSimple > 0.5) gb = texture2D(map, w1).rgb;   // low quality: one texture scale, no macro variation
        else gb = mix((texture2D(map, w1).rgb + texture2D(map, w4).rgb) * 0.5, (texture2D(map, w2).rgb + texture2D(map, w5).rgb) * 0.5, 0.35);
        gb = uAvg + (gb - uAvg) * 1.6;
        float glum = dot(gb, vec3(0.299, 0.587, 0.114));
        gb = mix(vec3(glum), gb, uSat) * uTint;
        float macro = uSimple > 0.5 ? 1.0 : dot(texture2D(map, w3).rgb, vec3(0.333)) / max(0.02, dot(uAvg, vec3(0.333)));
        float farK = smoothstep(180.0, 1100.0, length(vViewPosition));
        gb *= mix(clamp(0.74 + 0.36 * macro, 0.62, 1.3), 1.0, farK);
        vec3 gmean = mix(vec3(dot(uAvg, vec3(0.299, 0.587, 0.114))), uAvg, uSat) * uTint;
        gb = mix(gb, gmean, farK * 0.85);
        if (uHasImg * inP > 0.5) {
          vec3 im = texture2D(uImg, puv).rgb * uImgTint;
          float grain = glum / max(0.02, dot(uAvg, vec3(0.299, 0.587, 0.114)));
          float nearW = (1.0 - smoothstep(20.0, 130.0, length(vViewPosition))) * mix(0.5, 0.9, clamp(slopeDeg / 25.0, 0.0, 1.0));
          gb = im * mix(1.0, clamp(grain, 0.55, 1.5), nearW);
        }
        #endif
        vec3 modeTint = vec3(1.0);
        if (uMode == 1) modeTint = 0.4 + 0.6 * ramp4(slopeDeg / 30.0, vec3(0.62, 0.86, 0.66), vec3(0.95, 0.92, 0.55), vec3(0.98, 0.7, 0.45), vec3(0.95, 0.5, 0.45), 0.35, 0.7);
        else if (uMode == 2) modeTint = 0.4 + 0.6 * ramp4((vWPos.y / uEx - uSpan.x) / (uSpan.y - uSpan.x), vec3(0.55, 0.68, 0.9), vec3(0.6, 0.85, 0.82), vec3(0.95, 0.9, 0.7), vec3(1.0, 0.97, 0.94), 0.35, 0.65);
        if (uMode != 0) gb = mix(gb, vec3(dot(gb, vec3(0.333))), 0.6) * modeTint * 1.25;
        diffuseColor.rgb *= max(gb, vec3(0.0));`).replace(`#include <roughnessmap_fragment>`,`float roughnessFactor = roughness;
 #ifdef USE_ROUGHNESSMAP
 roughnessFactor *= clamp(mix(texture2D(roughnessMap, w1).g, texture2D(roughnessMap, w2).g, 0.35), 0.6, 1.0);
 #endif`).replace(`#include <normal_fragment_maps>`,`
        if (hasG > 0.5) normal = normalize((viewMatrix * vec4(normalize(vec3(-gH.x * uEx, 1.0, -gH.y * uEx)), 0.0)).xyz);
        #ifdef USE_NORMALMAP
        if (uNrmOn > 0.5) {
        mat3 tbnG = getTangentFrame(-vViewPosition, normal, vNormalMapUv);
        vec3 n1 = texture2D(normalMap, w1).xyz * 2.0 - 1.0; vec3 n2 = texture2D(normalMap, w2).xyz * 2.0 - 1.0;
        vec3 mapN = normalize(vec3(n1.xy + n2.xy * 0.8, n1.z));
        float dnear = 1.0 - smoothstep(50.0, 800.0, length(vViewPosition));
        mapN.xy *= uNrm * dnear;
        normal = normalize(tbnG * mapN);
        }
        #endif`)},o}var Vm={moon:{top:0,hor:460811,fog:460811},mars:{top:8149576,hor:13607551,fog:13607551},earth:{top:3897533,hor:12375014,fog:12375014}};function Hm(e,t){let n=Vm[e],r=new br({uniforms:{top:{value:new W(n.top)},hor:{value:new W(n.hor)}},vertexShader:`varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`uniform vec3 top; uniform vec3 hor; varying vec3 vD; void main(){ float t = pow(clamp(vD.y * 1.4, 0.0, 1.0), 0.55); gl_FragColor = vec4(mix(hor, top, t), 1.0); }`,side:1,depthWrite:!1,fog:!1}),i=new lr(new Ls(t*.85,32,16),r);return i.renderOrder=-2,i.frustumCulled=!1,i}function Um(){$.sides.forEach(e=>{e.mat.userData.U.uMode.value={plain:0,slope:1,elev:2}[$.mode]}),fm()}function Wm(e){fm();let t=e.patch,n=$.exag,r=t.size/2;e.ground.setExag(n),e.mat.userData.U.uEx.value=n,e.tracks&&e.tracks.reset();let i=[],a=(e,n)=>{let r=e*t.size;return n===0?[r,0]:n===1?[t.size,r]:n===2?[t.size-r,t.size]:[0,t.size-r]};for(let e=0;e<4;e++)for(let o=0;o<64;o++){let[s,c]=a(o/64,e);i.push(s-r,pu(t,s,c)*n+.6,c-r)}e.outline.geometry.dispose(),e.outline.geometry=new Gn,e.outline.geometry.setAttribute(`position`,new Ln(i,3)),$.runs&&wh()}function Gm(e){if(!e||!e.img)return null;let t=Math.min(8,$.renderer.capabilities.getMaxAnisotropy()),n=e=>{let n=new js(e);return n.flipY=!1,n.colorSpace=oe,n.anisotropy=t,n.needsUpdate=!0,n};return{gray:!1,img:n(e.img.canvas),ctx:e.ctx?n(e.ctx.canvas):null}}function Km(e,t,n,r,i,a,o,s){let c=e.size/2e3,l=e.size*30,u=Vm[t],d=new zo;d.fog=new Ro(u.fog,2200*c,7200*c);let f=Hm(t,l);d.add(f);let p=new hc(11125992,4866872,1.2);d.add(p);let m=new Oc(16773852,3.2);m.castShadow=!0,m.shadow.mapSize.set(1536,1536),m.shadow.bias=-4e-4,d.add(m,m.target);let h=[],g=e=>(e&&h.push(e),e),_=g(dd(e,Math.min(4,$.renderer.capabilities.getMaxAnisotropy()))),v=Gm(o);v&&(g(v.img),g(v.ctx));let y=Bm(t,r,a,{size:e.size,span:[e.min,e.max],slopeTex:_,img:v&&v.img,gray:v&&v.gray}),b=e.C?v&&v.ctx?Bm(t,r,a,{size:e.C.size,span:[e.min,e.max],slopeTex:null,img:v.ctx,gray:v.gray}):y:null,x=new fd(d,e,y,b,{k:+new URLSearchParams(location.search).get(`lod`)||.03,rock:{color:zm[t],abundance:lm(.3+.03*e.stats.slope_med,.25,.75)}}),S=new Cs(new Gn,new ps({color:n,transparent:!0,opacity:.35}));S.renderOrder=4,d.add(S);let C=new ps({color:n,transparent:!0,opacity:.4}),w=new ys(new Gn,C),T=new ys(new Gn,new ps({color:16777215}));w.renderOrder=T.renderOrder=5,w.visible=T.visible=!1,d.add(w,T);let E=new lr(new Ns(.35,1,14),new jn({color:n,transparent:!0,opacity:.95,fog:!1,depthTest:!1}));E.renderOrder=8,E.rotation.x=Math.PI,d.add(E);let D={idx:i,patch:e,body:t,scene:d,sky:f,sun:m,hemi:p,mat:y,ctxMat:b,ground:x,tracks:new md(d),own:h,outline:S,line:w,lineOn:T,marker:E,color:n,rover:null,pose:{init:!1},...s};return Wm(D),Om(D),D}async function qm(){let e=Y.cfg,t=[];for(let n=0;n<$.sides.length;n++)t.push(await bf(e));return $.sides.forEach((e,n)=>{e.rover&&e.rover.dispose(),e.rover=t[n],e.scene.add(t[n].root)}),$.sides.forEach(Om),await vf(e.model).catch(e=>console.error(e)),Y.modelError&&mm(Y.modelError),!0}var Jm=()=>eu.meta.gravity.earth,Ym={mars:`Mars`,moon:`Moon`,earth:`Earth`},Xm=e=>{let t=Q(e.muId);return t?+t.value:wu(e.soil)};function Zm(){let e=$.ctx,t=Y.reg.soils[e.soil.cls],n={soil:e.soil.soil,S:t,cls:t.label,clsId:e.soil.cls,patch:$.patch,body:`earth`,imagery:$.imagery,traits:e.traits,muId:`muE`,same:!0};return[{...n,key:`target`,label:`${e.target.bodyName} gravity`,short:`${e.target.bodyName} g`,g:e.target.gravity,color:3718648,dvLine:`This Earth ground at the gravity of ${e.target.name}`},{...n,key:`earth`,label:`Earth gravity`,short:`Earth g`,g:Jm(),color:16486972,dvLine:`This Earth ground at its own gravity`}]}function Qm(){let e=$.ctx,t=$.tg,n=t.target.traits,r=hu(n),i=Y.reg.soils[r],[,a]=Zm();return[{key:`target`,same:!1,patch:t.patch,body:t.target.body,imagery:null,traits:n,soil:n.soil,S:i,cls:i.label,clsId:r,muId:`muT`,g:t.target.gravity,color:3718648,label:`${Ym[t.target.body]} ground`,short:t.target.short,title:t.title,dvLine:`${t.target.name}, at ${Ym[t.target.body]} gravity`},{...a,same:!1,label:`Earth ground`,short:`Earth`,title:`Earth: ${e.place.name} · ${Jm()} m/s²`,dvLine:`This Earth place at its own gravity`}]}var $m=()=>$.gmode===`compare`&&!!$.tg;function eh(){if($m())return Qm();let[e,t]=Zm();return $.gmode===`both`?[e,t]:$.gmode===`target`?[e]:[t]}function th(){let e=$m(),[t,n]=e?Qm():Zm();return[{...t,mu:Xm(t),route:$.routes[0]},{...n,mu:Xm(n),route:e&&$.routes[1]||$.routes[0]}]}function nh(){if(!$.ctx||!$.runs)return null;let[e,t]=th();return{gT:$.ctx.target.gravity,grounds:$.gmode===`earth`?[t,e]:[e,t]}}var rh=0,ih=``;async function ah(e){$.open&&!$.drive&&$.runs&&(e===`rover`?(await qm(),Sh()):$.sides.forEach(e=>Cf(e.rover,Y.cfg)),Ch(),$.runs.verdictShown=!1,Q(`vpVerdict`).classList.add(`hidden`),Q(`verdict`).classList.add(`hidden`),yh(),$.sides.forEach(e=>{e.pose.init=!1}),zh(!0),Hf())}async function oh(){$.playing=!1,$.u=0,$.snap=!0,$.shown=!1,$.runs=null,$.routes=null,_m(`the old panes`,null,uh);let e=eh(),t=e.length>1;return Q(`vpStage`).classList.toggle(`single`,!t),Q(`linkWrap`).classList.toggle(`hidden`,!t),$.gl&&_m(`the 3D terrain`,null,()=>($.sides=e.map((e,n)=>Km(e.patch,e.body,t?e.color:16486972,$.tex,n,e.traits,e.imagery,e)),Q(`exag`).value=1,Q(`exagO`).textContent=`1`,$.exag=1,Th(!1),Um(),$.cams.forEach((e,t)=>{let n=($.sides[t]||$.sides[0]).patch.size;e.camera.near=Math.max(.25,n*12e-5),e.camera.far=n*30,e.camera.updateProjectionMatrix(),e.controls.maxDistance=n*1.9,e.anim=null}),!0))?(await vm(`the rover`,`roverBar`,qm)!==void 0&&(_m(`the rover simulation`,`simStatus`,()=>{Sh(),Ch()}),$.sides.forEach(e=>{e.rover&&(e.rover.root.visible=!0),e.line.visible=e.lineOn.visible=!0,e.pose.init=!1}),Q(`vpVerdict`).classList.add(`hidden`),Q(`verdict`).classList.add(`hidden`),_m(`the rover simulation`,`simStatus`,()=>zh(!0))),_m(`the labels`,`siteTitle`,fh),_m(`the camera`,null,()=>Dh(!1,!0)),$.lodReady=!1,fm(),!0):($.sides=[],mm(`The 3D view is not available. The panels still work.`),!1)}async function sh({host:e,ctx:t,patch:n,imagery:r,targetGround:i,onBack:o}){if(a(),$=am(),$.host=e,$.ctx=t,$.patch=n,$.imagery=r,$.onBack=o,$.tg=i||null,$.gmode=$.tg?`compare`:`earth`,e.insertAdjacentHTML(`beforeend`,ym),Tm(wm(),!1),Ld.scale=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?.05:1,$.gl=!!_m(`the 3D renderer`,null,()=>(xm(),!0)),_m(`the rover registry`,null,()=>{tf(eu.rovers,t.target.body)}),Y.error&&mm(Y.error),i===null&&mm(`The ${t.target.bodyName} ground could not be loaded, so this Earth place is shown on its own.`),_m(`the rover panel`,`roverBar`,()=>{$.off.push(af(e=>{ih=ih===`rover`||e===`rover`?`rover`:e,clearTimeout(rh),rh=setTimeout(()=>{let e=ih;ih=``,ah(e).catch(e=>hm(`simStatus`,`the rover build`,e))},ih===`rover`?0:100)})),Lf({ctx:nh})}),$.gl)try{await Im()}catch(e){console.error(e),mm(`Could not load the ground textures: ${pm(e)}. A plain ground colour is used.`)}_m(`the view layout`,null,()=>{Mm(),Am(),jm()}),_m(`the ground table`,`cmpTable`,mh),_m(`the soil table`,`soilTable`,_h),_m(`the target ground table`,`tgtTable`,gh),_m(`the rover simulation panel`,`simInputs`,bh),_m(`the similarity score`,null,vh);{let e=$.tg&&$.tg.target.polar?8:35;Q(`sunEl`).value=e,Q(`sunElO`).textContent=String(e)}Q(`sunAz`).value=135,Q(`sunAzO`).textContent=`135`,Pm(),Q(`follow`).checked=$.follow=!0,Q(`link`).checked=$.link=!0,_m(`the default rover`,null,()=>{Y.picked||Y.recalled||Y.error||cf(nf(t.target.body))}),await oh(),$.open=!0,cancelAnimationFrame($.raf),$.last=performance.now(),$.frameErr=!1,$.simErr=!1,$.lodReady=!1,$.sides.length&&($.raf=requestAnimationFrame(Uh)),window.TERRA_SITE=$,_m(`the VR button`,null,()=>mp(ch))}var ch={get V(){return $},slot:()=>Q(`vrSlot`),siteNote:mm,advancePlayback:Gh,togglePlay:Eh,restart:()=>{$.u=0,$.snap=!0,$.shown=!1,Th(!0)},setSpeed:e=>{$.speed=e,jm()},setExag:e=>{Q(`exag`).value=e,Q(`exagO`).textContent=String(e),$.exag=e,$.sides.forEach(Wm),zh(!0)},setShadowSize:Dm,applySide:Om,wake:fm,title:e=>e.title||(e.same&&e.key===`target`?`Earth ground at ${$.ctx.target.bodyName} gravity · ${e.g} m/s²`:`Earth: ${$.ctx.place.name} · ${e.g} m/s²`),startSide:()=>$m()?0:Math.max(0,$.sides.findIndex(e=>e.key===`earth`)),resume:()=>{$.open&&($.renderer.setScissorTest(!0),Mm(),$.sides.forEach(Om),$.last=performance.now(),$.snap=!0,$.lodReady=!1,fm(2e3),cancelAnimationFrame($.raf),$.raf=requestAnimationFrame(Uh))}};function lh(e){let t=new Set;if($.tex)for(let e in $.tex){let n=$.tex[e];t.add(n.map),t.add(n.normal),t.add(n.rough)}e.traverse(e=>{e.geometry&&e.geometry.dispose();for(let n of[].concat(e.material||[])){for(let e in n){let r=n[e];r&&r.isTexture&&!t.has(r)&&r.dispose()}n.dispose()}e.isLight&&e.dispose&&e.dispose()}),e.clear()}function uh(){$.sides.forEach(e=>{e.rover&&=(e.rover.dispose(),null),e.tracks.dispose(),e.ground.dispose(),e.own.forEach(e=>e.dispose()),e.ctxMat&&e.ctxMat!==e.mat&&e.ctxMat.dispose(),lh(e.scene)}),$.sides=[],$.renderer&&$.renderer.renderLists.dispose()}async function dh(){await yp(),$.drive&&await $.drive.exit(!0),n(),$.open=!1,cancelAnimationFrame($.raf),$.playing=!1,clearTimeout(rh),_m(`the old terrain`,null,uh),$.runs=null,$.routes=null,md.mat&&md.mat.dispose();try{(await i(()=>import(`./drivemode-DPM-dv4F.js`),__vite__mapDeps([0,1,2]))).disposeDrive()}catch(e){console.error(e)}if(await vf(null).catch(e=>console.error(e)),$.tex){for(let e in $.tex){let t=$.tex[e];t.map.dispose(),t.normal.dispose(),t.rough.dispose()}$.tex=null}$.cams.forEach(e=>e.controls.dispose()),$.cams=[],$.ro&&$.ro.disconnect(),$.off.forEach(e=>{try{e()}catch{}}),$.off=[],Bf(),$.renderer&&($.renderer.renderLists.dispose(),$.renderer.setSize(1,1,!1),$.renderer=null),$.host&&($.host.innerHTML=``),delete window.TERRA_SITE,$=am()}function fh(){let e=$.ctx;Q(`siteTitle`).innerHTML=`<span class="r">${um(e.place.name)}</span><span class="meta">${e.place.lat.toFixed(4)}, ${e.place.lon.toFixed(4)} &middot; 2 km patch, 10 km context &middot; target ${um(e.target.name)}</span>`;let t=t=>t.key===`target`&&!t.same?(()=>{let e=t.patch.prov&&t.patch.prov.site_center||[$.tg.target.lat,$.tg.target.lon];return`${(t.patch.size/1e3).toFixed(0)} km patch at ${e[0].toFixed(3)}, ${e[1].toFixed(3)}`})():t.same?`g ${t.g} m/s&sup2; &middot; same Earth ground`:`${e.place.lat.toFixed(3)}, ${e.place.lon.toFixed(3)}`,n=n=>`${n.title?um(n.title):n.key===`target`?`At ${um(e.target.bodyName)} gravity`:`At Earth gravity`}<small>${t(n)}</small>`;Q(`vpLeft`).innerHTML=$.sides[0]?n($.sides[0]):``,Q(`vpRight`).innerHTML=$.sides[1]?n($.sides[1]):``,Q(`viewInfo`).innerHTML=r($m()?`Left is the real ${Ym[$.tg.target.body]} ground, right is this Earth place. North is at the top in both, and the rocks are for looks only.`:$.sides.length>1?`Both views show the same Earth ground, and only gravity differs. North is at the top, and the rocks are for looks only.`:`North is at the top. The close-up texture and the rocks are for looks only. The area outside the outline is the wider 10 km surroundings.`,`About this view`)}function ph(e,t){return`<tr><td>${um(e)}</td><td class="n">${um(t)}</td></tr>`}function mh(){let e=$.patch.prov,t=$.imagery,n=$.patch.stats,i=e=>(e>=10?e.toFixed(0):e.toFixed(1))+` m`;Q(`cmpTable`).innerHTML=[ph(`Elevation source`,e.elevation_source),ph(`Elevation spacing`,`${i(e.spacing_ns_m)} N-S${e.spacing_ew_m?`, ${i(e.spacing_ew_m)} E-W`:``}`),ph(`Fine grid`,`${uu($.patch).M} x ${uu($.patch).M} at ${($.patch.size/(uu($.patch).M-1)).toFixed(2)} m`),ph(`Below about `+i(2*e.elevation_resolution_m),e.synthetic_fine?`interpolation plus fractal detail, rms ${(e.fine_detail_rms_m*100).toFixed(0)} cm`:`source`),ph(`Context ring`,`${e.ctx.n} x ${e.ctx.n} at 62.5 m, ${Math.round(e.ctx.valid*100)} % with data`),ph(`Imagery`,t&&t.img?`${t.spec.label}, zoom ${t.img.zoom} (${i(t.img.tilePixelM)} pixels)`:`none`),ph(`Median slope, 90th pct`,`${n.slope_med.toFixed(1)}°, ${n.slope_p90.toFixed(1)}°`),ph(`Relief in the patch`,i(n.relief)),ph(`Lowest point`,`${e.hmin.toFixed(1)} m (EGM2008)`)].join(``);let a=[],o=[];t&&t.img&&(a.push(`${t.spec.attribution}. Terms: ${t.spec.terms}`),o.push(t.spec.short)),(e.licence||[]).forEach(e=>{a.push(`${e}.`),o.push(hh(e))}),$.tg&&$.tg.patch.prov&&$.tg.patch.prov.licence&&$.tg.patch.prov.licence.forEach(e=>{a.push(`${$.tg.target.name}: ${e}.`),o.push(hh(e))});let s=[...new Set(o)].join(` · `);Q(`siteCredits`).innerHTML=s?`<span class="sc-line">${um(s)}</span>${r(a.join(` `),`Full credits and licences`)}`:``}function hh(e){return/^Copernicus DEM/i.test(e)?`Copernicus DEM © DLR, Airbus (ESA)`:/^USGS/i.test(e)?`USGS / NASA`:/^NASA/i.test(e)?`NASA`:e.split(/[:;]/)[0].trim()}function gh(){let e=Q(`tgtSec`);if(!$.tg){e.classList.add(`hidden`);return}let t=$.tg.target,n=$.tg.patch,r=n.prov||{},i=n.stats,a=Y.reg.soils[hu(t.traits)],o=e=>(e>=10?e.toFixed(0):e.toFixed(1))+` m`;Q(`tgtHead`).textContent=`${Ym[t.body]} ground`,Q(`tgtTable`).innerHTML=[ph(`Place`,t.name),ph(`Elevation source`,r.real?r.elevation_source:`stand-in terrain (no elevation data for this place yet)`),...r.real?[ph(`Elevation spacing`,o(r.size_m/(r.real.n-1)))]:[],ph(`Median slope, 90th pct`,`${i.slope_med.toFixed(1)}°, ${i.slope_p90.toFixed(1)}°`),ph(`Relief in the patch`,o(i.relief)),ph(`Gravity`,`${t.gravity} m/s²`),ph(`Ground class`,a.label),ph(`Soil competence, dust`,`${t.traits.soil.toFixed(2)}, ${t.traits.dust.toFixed(2)}`),ph(`Friction (default)`,wu(t.traits.soil).toFixed(2))].join(``),e.classList.remove(`hidden`)}function _h(){let e=$.ctx.soil,t=Y.reg.soils[e.cls];Q(`soilTable`).innerHTML=e.rows.map(e=>ph(e.field,e.value)).join(``)+ph(`Friction (default)`,wu(e.soil).toFixed(2))+ph(`Bekker n, kc, kphi (${t.label})`,`${t.n}, ${t.kc}, ${t.kphi}`)}function vh(){let e=Q(`simScore`),t=$.ctx.similarity;!t||!t.text||!t.target?(e.classList.add(`hidden`),e.innerHTML=``):(e.innerHTML=`<div class="sim-score-text">Similarity to ${um(t.target)} ${r(`How closely this Earth place matches the chosen Moon or Mars site across terrain, rock, climate and other factors. Higher is closer.`,`About the similarity score`)}</div><div class="sim-score-num">${um(t.text)}</div>`,e.classList.remove(`hidden`))}function yh(){let e=$.ctx,t=Y.cfg,n=e.target.gravity,i=t.mass_kg*n/9.81,a=t.base_badge===`test`,o=Q(`eqMassLbl`);o&&(o.innerHTML=a?`Equal wheel load: not needed for this rover ${r(`This test rover is already built to weigh on Earth what Curiosity weighs on Mars, so it does not need this.`,`About equal wheel load`)}`:`Equal wheel load at Earth gravity (${i.toFixed(0)} kg) ${r(`Makes the rover lighter on Earth, so its wheels press on the ground as hard as they would on Mars or the Moon. NASA's Scarecrow test rover works the same way.`,`About equal wheel load`)}`,Q(`eqMass`).disabled=a,a&&(Q(`eqMass`).checked=!1))}function bh(){let e=$.ctx;Q(`simInputs`).innerHTML=`
    <div class="gsel"><span>Compare</span><div class="seg small" id="gMode" role="radiogroup" aria-label="What to compare">
      ${$.tg?`<button data-g="compare" role="radio">${Ym[$.tg.target.body]} ground vs Earth</button>`:``}<button data-g="both" role="radio">Same ground, two gravities</button><button data-g="earth" role="radio">Earth 9.81</button><button data-g="target" role="radio">${um(e.target.bodyName)} ${e.target.gravity}</button></div></div>
    ${$.tg?`<label id="muTWrap">Friction, ${Ym[$.tg.target.body]} ground<input id="muT" type="range" min="0.2" max="1" step="0.01" value="${wu($.tg.target.traits.soil).toFixed(2)}"><output></output></label>`:``}
    <label><span id="muELbl">Friction, Earth ground</span><input id="muE" type="range" min="0.2" max="1" step="0.01" value="${wu(e.soil.soil).toFixed(2)}"><output></output></label>
    <label class="chk"><input id="eqMass" type="checkbox"><span id="eqMassLbl"></span></label>`;let t=()=>{Q(`gMode`).querySelectorAll(`button`).forEach(e=>{e.classList.toggle(`active`,e.dataset.g===$.gmode),e.setAttribute(`aria-checked`,e.dataset.g===$.gmode)}),Q(`muTWrap`)&&Q(`muTWrap`).classList.toggle(`hidden`,!$m()),Q(`muELbl`).textContent=$m()?`Friction, Earth ground`:`Friction, this soil`};t(),Q(`gMode`).onclick=e=>{let n=e.target.closest(`button`);n&&n.dataset.g!==$.gmode&&!$.drive&&($.gmode=n.dataset.g,t(),oh().then(()=>{yh(),Hf()}))},Q(`simInputs`).querySelectorAll(`input[type=range]`).forEach(e=>{let t=e.nextElementSibling;t.textContent=(+e.value).toFixed(2),e.oninput=()=>{t.textContent=(+e.value).toFixed(2),$.runs&&_m(`the rover simulation`,`simStatus`,()=>{Ch(),zh(!0)})}}),Q(`eqMass`).onchange=()=>{$.runs&&_m(`the rover simulation`,`simStatus`,()=>{Ch(),zh(!0)})},yh(),Q(`charts`).innerHTML=[[`tilt`,`Tilt (deg)`],[`slip`,`Slip (%)`],[`e`,`Energy (J/m)`],[`v`,`Speed (m/s)`]].map(([e,t])=>`<div><div class="cl">${t}</div><canvas data-k="${e}"></canvas></div>`).join(``),Q(`simStatus`).textContent=``,kh()}function xh(e){let t=[],n=[Su[0]*e.size,Su[1]*e.size],r=[Cu[0]*e.size,Cu[1]*e.size],i=Math.hypot(r[0]-n[0],r[1]-n[1]),a=Math.max(2,Math.round(i/2));for(let e=0;e<=a;e++)t.push([n[0]+(r[0]-n[0])*e/a,n[1]+(r[1]-n[1])*e/a]);return t}function Sh(){let e=Y.cfg,t=new Map;$.routes=$.sides.map(n=>(t.has(n.patch)||t.set(n.patch,Au(n.patch,e)||xh(n.patch)),t.get(n.patch)))}function Ch(){let e=Y.cfg,[t,n]=th(),r=t.g,i=n.g,a=(t,n,r)=>Fu(t.patch,t.route,e,{g:n,mass:r,mu:t.mu,soil:t.soil,S:t.S}),o=a(t,r,e.mass_kg),s=a(n,i,e.mass_kg),c=a(n,i,e.base_badge===`test`?e.mass_kg:e.mass_kg*r/i),l=Q(`eqMass`).checked?c:s;$.runs={A:$.sides.map(e=>e.key===`target`?o:l),T:o,Er:s,Eq:c,ctx:{gTarget:r,gEarth:i,rover:e.name,kind:e.kind},grounds:[t.clsId,n.clsId],sm:null,verdictShown:!1},wh()}function wh(){$.sides.forEach((e,t)=>{let n=$.routes[t],r=e.patch.size/2,i=new Float32Array(n.length*3),a=$.exag;n.forEach(([t,n],o)=>{i[o*3]=t-r,i[o*3+1]=pu(e.patch,t,n)*a+2.2,i[o*3+2]=n-r});let o=new Pn(i,3);e.line.geometry.dispose(),e.line.geometry=new Gn,e.line.geometry.setAttribute(`position`,o),e.lineOn.geometry.dispose(),e.lineOn.geometry=new Gn,e.lineOn.geometry.setAttribute(`position`,o),e.lineOn.geometry.setDrawRange(0,1)})}function Th(e){$.playing=e,fm(),Q(`playBtn`).classList.toggle(`playing`,e),Q(`playBtn`).setAttribute(`aria-label`,e?`Pause`:`Play`),Q(`playBtn`).querySelector(`.lbl`).textContent=e?`Pause`:`Play`,e&&(Q(`vpVerdict`).classList.add(`hidden`),$.follow&&$.u<.02&&!$.chased&&Dh(!0))}function Eh(){$.u>=1&&($.u=0,$.snap=!0,$.shown=!1),Th(!$.playing)}function Dh(e,t){$.chased=e,fm(2500),$.sides.forEach((n,r)=>{let i=$.cams[r],a=n.patch,o=$.exag,s,c;if(e&&$.runs){let e=$.routes[r],t=e[0],i=e[Math.min(e.length-1,6)],a=Math.atan2(i[1]-t[1],i[0]-t[0]);s=n.rover.root.position.clone(),c=new H(-Math.cos(a)*15,8,-Math.sin(a)*15).add(new H(-Math.sin(a)*5,0,Math.cos(a)*5))}else{let e=Math.max(.5,i.camera.aspect),t=50*Math.PI/180,n=2*Math.atan(Math.tan(t/2)*e),r=a.size*.74/Math.sin(Math.min(t,n)/2);s=new H(0,pu(a,a.size/2,a.size/2)*o,0),c=new H(0,Math.sin(.62),Math.cos(.62)).multiplyScalar(r)}let l=s.clone().add(c);t||Ld.scale<.2?(i.camera.position.copy(l),i.controls.target.copy(s),i.controls.update(),i.anim=null):i.anim={t0:performance.now(),dur:900*Ld.scale,fp:i.camera.position.clone(),ft:i.controls.target.clone(),tp:l,tt:s}})}function Oh(e,t,n,r){let i=$.sides[e],a=$.runs.A[e],o=Y.cfg,s=Math.min(a.n-2,Math.floor(t)),c=lm(t-s,0,1),l=s+1,u=a.x[s]+(a.x[l]-a.x[s])*c,d=a.z[s]+(a.z[l]-a.z[s])*c,f=a.psi[l]-a.psi[s];f=Math.atan2(Math.sin(f),Math.cos(f)),od(i,u,d,a.psi[s]+f*c,{par:o,ex:$.exag,dt:n,snap:r,sink:a.sink?a.sink[s]+(a.sink[l]-a.sink[s])*c:0,wheelAng:(a.s[s]+(a.s[l]-a.s[s])*c)/o.wheel_radius_m,moving:$.playing});let p=Math.round(t);i.lineOn.geometry.setDrawRange(0,Math.min(a.n,p+1))}function kh(){let e=(e,t)=>`<div><span>${t}</span><span data-k="${e}">-</span></div>`;[`L`,`R`].forEach(t=>{Q(`hud`+t).innerHTML=e(`time`,`Time`)+e(`dist`,`Distance`)+e(`tilt`,`Tilt`)+e(`slip`,`Slip`)+e(`e`,`Energy per m`)+e(`E`,`Energy used`)}),Q(`liveCmp`).innerHTML=[[`tilt`,`Tilt`],[`slip`,`Slip`],[`e`,`Energy per m`],[`time`,`Time`]].map(([e,t])=>`<div class="lc-row" data-k="${e}"><span class="lc-t"></span><div class="lc-mid"><label>${t}</label><div class="lc-bar"><i class="a"></i><i class="b"></i></div></div><span class="lc-e"></span></div>`).join(``);let t=e=>{let t={};return Q(e).querySelectorAll(`[data-k]`).forEach(e=>{t[e.dataset.k]=e}),t};$.hud={L:t(`hudL`),R:t(`hudR`),lc:{}},Q(`liveCmp`).querySelectorAll(`.lc-row`).forEach(e=>{$.hud.lc[e.dataset.k]={t:e.querySelector(`.lc-t`),e:e.querySelector(`.lc-e`),a:e.querySelector(`.a`),b:e.querySelector(`.b`)}})}var Ah=(e,t)=>{e.textContent!==t&&(e.textContent=t)};function jh(e,t,n){Ah(e.time,(t.t[n]/60).toFixed(1)+` min`),Ah(e.dist,t.s[n].toFixed(0)+` m`),Ah(e.tilt,t.tilt[n].toFixed(1)+`°`),Ah(e.slip,t.slip[n].toFixed(0)+` %`),Ah(e.e,t.e[n].toFixed(0)+` J`),Ah(e.E,(t.E[n]/3600).toFixed(1)+` Wh`)}function Mh(e,t,n,r,i){let a=t/Math.max(1e-9,t+n)*100;Ah(e.t,t.toFixed(r)+i),Ah(e.e,n.toFixed(r)+i),e.a.style.width=a.toFixed(1)+`%`,e.b.style.width=(100-a).toFixed(1)+`%`}function Nh(e){let t=$.hud,n=$.runs.A;if(!t)return;let r=lm(Math.round(e[0]),0,n[0].n-1),i=n[0];if(jh(t.L,i,r),n.length<2)return;let a=lm(Math.round(e[1]),0,n[1].n-1),o=n[1];jh(t.R,o,a),Mh(t.lc.tilt,i.tilt[r],o.tilt[a],1,`°`),Mh(t.lc.slip,i.slip[r],o.slip[a],0,`%`),Mh(t.lc.e,i.e[r],o.e[a],0,` J`),Mh(t.lc.time,i.t[r]/60,o.t[a]/60,1,` min`)}function Ph(e,t=9){let n=new Float32Array(e.length),r=t>>1;for(let t=0;t<e.length;t++){let i=0,a=0;for(let n=Math.max(0,t-r);n<=Math.min(e.length-1,t+r);n++)i+=e[n],a++;n[t]=i/a}return n}function Fh(e){let t=$.runs;t.sm||=t.A.map(e=>({tilt:Ph(e.tilt),slip:Ph(e.slip),e:Ph(e.e),v:Ph(e.v)})),document.querySelectorAll(`#charts canvas`).forEach(n=>{let r=n.dataset.k,i=window.devicePixelRatio||1,a=n.clientWidth*i,o=n.clientHeight*i;if(!a)return;n.width!==a&&(n.width=a,n.height=o);let s=n.getContext(`2d`);if(s.clearRect(0,0,a,o),t.mx||={},!(r in t.mx)){let e=-1/0;for(let n of t.sm)for(let t=0;t<n[r].length;t++)n[r][t]>e&&(e=n[r][t]);t.mx[r]=e===0?1:e}let c=t.mx[r];t.A.forEach((n,l)=>{let u=$.sides[l]&&$.sides[l].key===`target`&&$.sides.length>1?rm:im,d=Math.round(e[l]);[[.28,n.n-1],[1,d]].forEach(([e,d])=>{s.globalAlpha=e,s.strokeStyle=u,s.lineWidth=1.6*i,s.beginPath();for(let e=0;e<=d;e+=2){let i=e/(n.n-1)*(a-4)+2,u=o-3-(t.sm[l][r][e]-0)/(c-0)*(o-8);e?s.lineTo(i,u):s.moveTo(i,u)}s.stroke()})}),s.globalAlpha=1})}function Ih(e,t){let n=[[t,e.T.totals,`t`],[`Earth`,e.Er.totals,`e`],[`Earth, equal load`,e.Eq.totals,`e`]],r=(e,t)=>`<tr><td>${e}</td>${n.map(([,e])=>`<td>${t(e)}</td>`).join(``)}</tr>`;return`<table class="res3"><tr><th></th>${n.map(([e,,t])=>`<th class="${t}">${e}</th>`).join(``)}</tr>
    ${r(`Drive time`,e=>`${(e.time/60).toFixed(0)} min`)}
    ${r(`Energy used`,e=>`${e.energy_Wh.toFixed(0)} Wh`)}
    ${r(`Average slip`,e=>`${e.slip_mean.toFixed(1)} %`)}
    ${r(`Wheel sinkage`,e=>`${e.sink_mean_mm.toFixed(1)} mm`)}
    ${r(`Largest tilt`,e=>`${e.tilt_max.toFixed(1)}°`)}
    ${r(`Got stuck`,e=>e.reachable?`No`:`<span class="stuck" title="${um((e.blockers||[]).join(`; `))}">Yes</span>`)}</table>`}var Lh=(e,t)=>t.unit===`°`||t.unit===`%`||t.unit===` min`||t.unit===` mm`||t.unit===` Wh`||t.unit===` kPa`?e.toFixed(1):Math.round(e).toLocaleString();function Rh(){let e=$.runs;if($.sides.length>1){let t=Vu(e.T,e.Er,e.Eq,e.ctx),n=t.match>=80?`good`:t.match>=60?`mid`:`bad`,i=e=>e.status===`rover`?`<span class="tagm gr">build</span>`:e.status===`match`?`<span class="tagm ok">match</span>`:e.status===`mismatch`?`<span class="tagm no">mismatch</span>`:`<span class="tagm gr">gravity</span>`,a=$m(),o=a?`${Ym[$.tg.target.body]} ground`:`${um($.ctx.target.bodyName)} g`,s=a?`Earth`:`Earth g`,c=a?`The same rover drives on the ${Ym[$.tg.target.body]} ground and on this Earth place. Big differences mean Earth testing here would mislead.`:`How alike the two drives are, from 0 to 100. Both use the same ground, so any difference comes from gravity alone.`;Q(`verdict`).innerHTML=`<div class="big ${n}">${Math.round(t.match)}/100 &middot; ${t.label} ${r(c,`About the comparison`)}</div>
    ${a?`<p class="verdict-line">${um(t.recommendation)}</p>${Ih(e,o)}<b>Match by metric</b>`:``}
    <table><tr><th>Metric</th><th>${o}</th><th>${s}</th><th></th></tr>${t.rows.map(e=>`<tr><td>${e.label}</td><td>${Lh(e.a,e)}${e.unit}</td><td>${Lh(e.b,e)}${e.unit}</td><td>${i(e)}</td></tr>`).join(``)}</table>
    ${t.mismatches.length?`<b>Mismatches</b><ul>${t.mismatches.map(e=>`<li>${$m()?e:e.replace(`on the target ground`,`at ${um($.ctx.target.bodyName)} gravity`).replace(`on the Earth site`,`at Earth gravity`)}</li>`).join(``)}</ul>`:`<b>Mismatches</b><ul><li>None on the terrain-driven metrics.</li></ul>`}
    <b>Gravity</b><p class="hint">${t.gravityNote}</p>`,Q(`vpVerdictBody`).innerHTML=`<div class="big ${n}">${Math.round(t.match)}/100</div><div><b>${t.label}</b><div class="hint">${t.mismatches.length?t.mismatches[0]:`The two drives behave alike on the terrain-driven metrics.`}</div></div>`,e.verdict=t}else{let t=e.A[0].totals,n=$.sides[0],i=[[`Distance`,t.dist,` m`],[`Drive time`,t.time/60,` min`],[`Mean tilt`,t.tilt_mean,`°`],[`Largest tilt`,t.tilt_max,`°`],[`Mean slip`,t.slip_mean,`%`],[`Energy per metre`,t.e_mean,` J/m`],[`Energy used on the route (battery `+Math.round(t.battery_wh)+` Wh)`,t.energy_Wh,` Wh`],[`Wheel sinkage, mean (simplified)`,t.sink_mean_mm,` mm`],[`Ground pressure under a wheel`,t.press_kPa,` kPa`],[`Friction-limited steepest slope`,t.max_climb_deg,`°`]],a=t.reachable?`good`:`bad`,o=t.reachable?`Reachable`:`Not reachable`;Q(`verdict`).innerHTML=`<div class="big ${a}">${o} ${r(`Reachable means the rover can finish the route on one battery charge without hitting a slope or grip limit.`,`About reachable`)}</div><div class="hint">At ${n.key===`target`?`${um($.ctx.target.bodyName)} gravity, ${n.g}`:`Earth gravity, 9.81`} m/s&sup2;.</div>
    <table><tr><th>Metric</th><th>This drive</th></tr>${i.map(([e,t,n])=>`<tr><td>${e}</td><td>${Lh(t,{unit:n})}${n}</td></tr>`).join(``)}</table>
    <b>Blockers</b><ul>${t.blockers.length?t.blockers.map(e=>`<li>${e}</li>`).join(``):`<li>None.</li>`}</ul>`,Q(`vpVerdictBody`).innerHTML=`<div class="big ${a}">${o}</div><div><b>${t.blockers.length?`Blocked`:`Route completed`}</b><div class="hint">${t.blockers[0]||`${(t.time/60).toFixed(0)} min, ${t.energy_Wh.toFixed(0)} Wh of ${Math.round(t.battery_wh)} Wh`}</div></div>`,e.verdict={single:t}}Q(`verdict`).classList.remove(`hidden`),Q(`vpVerdict`).classList.remove(`hidden`),Q(`simStatus`).textContent=``,e.verdictShown=!0}function zh(e){if(fm(),!$.runs)return;let t=$.runs.A.map(e=>$.u*(e.n-1));$.sides.forEach((n,r)=>Oh(r,t[r],.016,e)),Nh(t),Fh(t),Q(`scrub`).value=Math.round($.u*1e3),Q(`scrubO`).textContent=Math.round($.u*100)+` %`}function Bh(e,t){let n=$.sides[e],r=$.cams[e],i=r.camera,a=r.controls,o=n.patch,s=$.exag;if(r.anim){let e=r.anim,t=Math.min(1,(performance.now()-e.t0)/e.dur),n=Rd(t);i.position.lerpVectors(e.fp,e.tp,n),a.target.lerpVectors(e.ft,e.tt,n),t>=1&&(r.anim=null)}else if($.follow&&$.runs&&($.playing||$.chased)){cm.copy(n.rover.root.position),cm.y+=.8,sm.copy(cm).sub(a.target);let e=$.snap?1:1-Math.exp(-t*5);sm.multiplyScalar(e),a.target.add(sm),i.position.add(sm)}$.syncing=!0,a.update(),$.syncing=!1;let c=mu(o,i.position.x,i.position.z)*s,l=Math.max(1.6,.03*i.position.distanceTo(a.target));i.position.y<c+l&&(i.position.y=c+l);let u=mu(o,a.target.x,a.target.z)*s;a.target.y<u&&(a.target.y=u)}function Vh(){if($.sides.length<2||!$.link||$.dirty<0||$.cams[0].anim||$.cams[1].anim){$.dirty=-1;return}let e=$.dirty,t=1-e,n=$.cams[e],r=$.cams[t],i=$.exag;$.syncing=!0;let a=n.camera.position.clone().sub(n.controls.target);if(!$.follow){let a=mu($.sides[e].patch,n.controls.target.x,n.controls.target.z)*i,o=mu($.sides[t].patch,n.controls.target.x,n.controls.target.z)*i;r.controls.target.set(n.controls.target.x,o+(n.controls.target.y-a),n.controls.target.z)}r.camera.position.copy(r.controls.target).add(a),r.controls.update(),$.syncing=!1,$.dirty=-1}function Hh(e){let t=$.sides[e],n=$.cams[e],r=t.patch.size,i=n.controls.target,a=lm(n.camera.position.distanceTo(i)*1.25,45,r*.95)*($.q?$.q.ext:1);t.sun.target.position.copy(i),t.sun.position.copy(i).addScaledVector($.sunV,r*1.6);let o=t.sun.shadow.camera;Math.abs(o.right-a)>a*.05&&(o.left=-a,o.right=a,o.top=a,o.bottom=-a,o.near=1,o.far=r*4,o.updateProjectionMatrix(),t.sun.shadow.normalBias=a*.0025)}function Uh(e){if(!$.open||$.vr)return;$.raf=requestAnimationFrame(Uh);let t=!!($.drive||$.sides.length&&($.playing||$.snap||e<$.awake||$.cams[0].anim||$.cams[1].anim)),n=kd();try{Wh(e)}catch(e){$.frameErr||($.frameErr=!0,console.error(e),mm(`A drawing error occurred: ${pm(e)}`))}try{Ad(e,n,t)}catch{}}function Wh(e){let t=Math.min(.1,(e-$.last)/1e3);$.last=e,$.drive?$.drive.frame(t,e):$.sides.length&&($.playing||$.snap||e<$.awake||$.cams[0].anim||$.cams[1].anim)&&(Gh(t,e),$.lodForce=$.snap||!$.lodReady,$.lodReady=!0,$.sides.forEach((e,n)=>Bh(n,t)),$.snap=!1,Kh())}function Gh(e,t){let n=$.runs;if(n)try{$.playing&&($.u+=e*$.speed/$.DUR,$.u>=1&&($.u=1,Th(!1)));let r=$.kf||($.kf=[0,0]);for(let e=0;e<n.A.length;e++)r[e]=$.u*(n.A[e].n-1);for(let t=0;t<$.sides.length;t++)Oh(t,r[t],e,$.snap);Nh(r),($.playing||$.snap)&&(!$.lastChart||t-$.lastChart>90||$.snap)&&(Fh(r),$.lastChart=t),Q(`scrub`).value=Math.round($.u*1e3),Q(`scrubO`).textContent=Math.round($.u*100)+` %`,$.u>=1&&!n.verdictShown&&Rh(),$.u<1&&n.verdictShown&&(n.verdictShown=!1,Q(`vpVerdict`).classList.add(`hidden`))}catch(e){$.simErr||($.simErr=!0,hm(`simStatus`,`the rover simulation display`,e))}}function Kh(){Vh();let e=Q(`siteCanvas`),t=e.clientWidth,n=e.clientHeight,r=$.sides.length>1,i=Math.floor(t/2);if(!t||!n)return;let a=0;$.sides.forEach((e,o)=>{let s=$.cams[o].camera,c=o?i+1:0,l=r?o?t-i-1:i-1:t,u=l/n;if(Math.abs(s.aspect-u)>.001&&(s.aspect=u,s.updateProjectionMatrix()),Hh(o),e.rover){let t=e.focus||=[[0,0]];t[0][0]=e.rover.root.position.x,t[0][1]=e.rover.root.position.z}if(e.ground.update(s.position,$.lodForce,e.rover?e.focus:null)&&fm(300),e.rover&&e.ground.rocks&&e.ground.rocks.update(e.rover.root.position.x,e.rover.root.position.z),e.sky.position.copy(s.position),e.rover){let t=s.position.distanceTo(e.rover.root.position),n=Math.max(.2,t*.06);e.marker.visible=t>70,e.marker.scale.set(n,n*2.4,n),e.marker.position.set(e.rover.root.position.x,e.rover.root.position.y+2+n*1.2,e.rover.root.position.z)}else e.marker.visible=!1;$.renderer.setViewport(c,0,l,n),$.renderer.setScissor(c,0,l,n);let d=$.renderer.info.render.triangles;$.renderer.render(e.scene,s),a+=$.renderer.info.render.triangles-d}),$.frames=($.frames||0)+1,$.lastTris=a}function qh(){$.sides.forEach(e=>{e.line.visible=e.lineOn.visible=!0,e.pose.init=!1,e.tracks.reset()}),$.lodReady=!1,$.snap=!0,$.last=performance.now(),zh(!0),$.dirty=-1}function Jh(e){Th(e)}var Yh={setShadow:(e,t)=>Dm(e.sun,t),updateGeometryAll:()=>$.sides.forEach(Wm),setExag:e=>$.sides.forEach(t=>{t.ground.setExag(e),t.mat.userData.U.uEx.value=e})},Xh=class extends Error{};async function Zh(e,t,n,r){let i=await fetch(e,{headers:{Range:`bytes=${t}-${n}`},signal:r});if(i.status===404||i.status===403)throw new Xh(`HTTP ${i.status}`);if(!i.ok)throw Error(`HTTP ${i.status}`);let a=await i.arrayBuffer();return i.status===200&&a.byteLength>n-t+1?a.slice(t,n+1):a}var Qh={1:1,2:1,3:2,4:4,5:8,11:4,12:8,16:8};async function $h(e,t){let n=await Zh(e,0,32767,t),r=n.byteLength,i=new DataView(n);if(i.getUint16(0,!1)!==18761||i.getUint16(2,!0)!==42)throw Error(`not a little-endian classic TIFF`);let a=i.getUint32(4,!0),o=i.getUint16(a,!0),s=new Map,c=0;for(let e=0;e<o;e++){let t=a+2+12*e,n=i.getUint16(t,!0),r=i.getUint16(t+2,!0),o=i.getUint32(t+4,!0),l=(Qh[r]??1)*o,u=l<=4?t+8:i.getUint32(t+8,!0);s.set(n,{type:r,n:o,at:u}),c=Math.max(c,u+l)}c>n.byteLength&&(n=await Zh(e,0,c+1023,t),r+=n.byteLength,i=new DataView(n));let l=e=>{let t=s.get(e);if(!t)return[];let n=[];for(let e=0;e<t.n;e++){let r=t.at+e*(Qh[t.type]??1);n.push(t.type===3?i.getUint16(r,!0):t.type===4?i.getUint32(r,!0):t.type===12?i.getFloat64(r,!0):t.type===11?i.getFloat32(r,!0):i.getUint8(r))}return n},u=(e,t)=>l(e)[0]??t,d=u(256),f=u(257),p=u(258),m=u(259),h=u(339,1),g=u(317,1),_=u(322),v=u(323);if(p!==32||h!==3)throw Error(`unsupported sample format (${p} bit, format ${h})`);if(m!==8&&m!==32946)throw Error(`unsupported compression ${m}`);if(!_||!v)throw Error(`the file is not tiled`);if(g!==1&&g!==3)throw Error(`unsupported predictor ${g}`);let y=l(33550),b=l(33922),x=l(34735);if(y.length<2||b.length<6)throw Error(`no georeferencing`);let S=1;for(let e=4;e+3<x.length;e+=4)x[e]===1025&&(S=x[e+3]);let C=S===2?0:.5;return{url:e,width:d,height:f,tileW:_,tileH:v,offsets:l(324),counts:l(325),predictor:g,lon0:b[3]+C*y[0],lat0:b[4]-C*y[1],dLon:y[0],dLat:y[1],bytes:r,tiles:new Map}}async function eg(e){let t=new Blob([e]).stream().pipeThrough(new DecompressionStream(`deflate`));return new Uint8Array(await new Response(t).arrayBuffer())}function tg(e,t,n){let r=new Float32Array(t*n),i=new Uint8Array(r.buffer),a=t*4;for(let r=0;r<n;r++){let n=r*a;for(let t=1;t<a;t++)e[n+t]=e[n+t]+e[n+t-1]&255;for(let a=0;a<t;a++){let o=(r*t+a)*4;i[o+3]=e[n+a],i[o+2]=e[n+t+a],i[o+1]=e[n+2*t+a],i[o]=e[n+3*t+a]}}return r}function ng(e,t,n){let r=e.tiles.get(t);return r||(r=(async()=>{let r=await Zh(e.url,e.offsets[t],e.offsets[t]+e.counts[t]-1,n);e.bytes+=r.byteLength;let i=await eg(r);if(i.byteLength!==e.tileW*e.tileH*4)throw Error(`tile ${t}: ${i.byteLength} bytes after inflating`);return e.predictor===3?tg(i,e.tileW,e.tileH):new Float32Array(i.buffer,i.byteOffset,e.tileW*e.tileH)})(),r.catch(()=>e.tiles.delete(t)),e.tiles.set(t,r)),r}var rg=e=>Math.ceil(e.width/e.tileW),ig=2e3,ag=1e4,og=6371008.8,sg=Math.PI/180;function cg(e,t,n,r){let i=e*sg,a=t*sg,o=Math.hypot(n,r),s=o/og,c=Math.asin(Math.min(1,Math.max(-1,Math.cos(s)*Math.sin(i)+(o>0?r*Math.sin(s)*Math.cos(i)/o:0))));return[(((o>0?a+Math.atan2(n*Math.sin(s),o*Math.cos(i)*Math.cos(s)-r*Math.sin(i)*Math.sin(s)):a)/sg+180)%360+360)%360-180,c/sg]}var lg=(e,t,n,r,i)=>cg(e,t,r-n/2,n/2-i),ug=(e,t,n)=>`${e}_${t>=0?`N`:`S`}${String(Math.abs(t)).padStart(2,`0`)}_00_${n>=0?`E`:`W`}${String(Math.abs(n)).padStart(3,`0`)}_00_DEM`,dg=`https://elevationeuwest.blob.core.windows.net/copernicus-dem`,fg={"glo30-pc":{id:`glo30-pc`,label:`Copernicus DEM GLO-30 (Microsoft Planetary Computer)`,dLat:1/3600,resM:30,file:(e,t,n)=>`${dg}/COP30_hh/${ug(`Copernicus_DSM_COG_10`,e,t)}.tif?${n}`},"glo30-ot":{id:`glo30-ot`,label:`Copernicus DEM GLO-30 (OpenTopography copy)`,dLat:1/3600,resM:30,file:(e,t)=>`https://opentopography.s3.sdsc.edu/raster/COP30/COP30_hh/${ug(`Copernicus_DSM_10`,e,t)}.tif`},"glo90-pc":{id:`glo90-pc`,label:`Copernicus DEM GLO-90 (Microsoft Planetary Computer)`,dLat:1/1200,resM:90,file:(e,t,n)=>`${dg}/COP90_hh/${ug(`Copernicus_DSM_COG_30`,e,t)}.tif?${n}`}},pg=null;async function mg(e){if(pg&&pg.expires>Date.now()+12e4)return pg.value;let t=await fetch(`https://planetarycomputer.microsoft.com/api/sas/v1/token/elevationeuwest/copernicus-dem`,{signal:e});if(!t.ok)throw Error(`Planetary Computer token: HTTP ${t.status}`);let n=await t.json();return pg={value:n.token,expires:n[`msft:expiry`]?Date.parse(n[`msft:expiry`]):Date.now()+36e5},pg.value}var hg=class{files=new Map;data=new Map;spec;tok;constructor(e,t){this.spec=e,this.tok=t}bytes(){let e=0;for(let t of this.files.values())t&&(e+=t.bytes);return e}key=(e,t)=>`${e},${t}`;async openFile(e,t,n){let r=this.key(e,t);if(this.files.has(r))return this.files.get(r);let i=null;try{i=await $h(this.spec.file(e,t,this.tok),n)}catch(e){if(!(e instanceof Xh))throw e}return this.files.set(r,i),i}async prefetch(e,t,n,r,i){let a=2*this.spec.dLat,o=[];for(let s=Math.floor(e-a);s<=Math.floor(t+a);s++)for(let c=Math.floor(n-10*a);c<=Math.floor(r+10*a);c++){let l=((c+180)%360+360)%360-180;o.push(this.openFile(s,l,i).then(async o=>{if(!o)return;let c=Math.max(0,Math.floor((o.lat0-(t+a))/o.dLat)),u=Math.min(o.height-1,Math.ceil((o.lat0-(e-a))/o.dLat)),d=((n-10*a-o.lon0+180)%360+360)%360-180,f=d+(r-n)+20*a,p=Math.max(0,Math.floor(d/o.dLon)),m=Math.min(o.width-1,Math.ceil(f/o.dLon));if(c>u||p>m)return;let h=rg(o),g=[];for(let e=Math.floor(c/o.tileH);e<=Math.floor(u/o.tileH);e++)for(let t=Math.floor(p/o.tileW);t<=Math.floor(m/o.tileW);t++){let n=e*h+t,r=`${this.key(s,l)}#${n}`;this.data.has(r)||g.push(ng(o,n,i).then(e=>void this.data.set(r,e)))}await Promise.all(g)}))}await Promise.all(o)}pixel(e,t,n,r){let i=this.files.get(this.key(e,t));if(!i||n<0||r<0||n>=i.height)return NaN;if(r>=i.width){let a=t+1>=180?-180:t+1,o=this.files.get(this.key(e,a));return o?this.pixelOf(o,e,a,Math.round((o.lat0-(i.lat0-n*i.dLat))/o.dLat),r-i.width):NaN}return this.pixelOf(i,e,t,n,r)}pixelOf(e,t,n,r,i){if(r<0||r>=e.height||i<0||i>=e.width)return NaN;let a=Math.floor(r/e.tileH)*rg(e)+Math.floor(i/e.tileW),o=this.data.get(`${this.key(t,n)}#${a}`);if(!o)return NaN;let s=o[r%e.tileH*e.tileW+i%e.tileW];return Number.isFinite(s)&&s>-1e3&&s<9e3?s:NaN}along(e,t){let n=Math.ceil(e-1e-9)-1,r=Math.floor(t),i=this.files.get(this.key(n,r));if(!i)return NaN;let a=Math.round((i.lat0-e)/i.dLat),o=(t-i.lon0)/i.dLon,s=Math.floor(o),c=o-s,l=this.pixel(n,r,a,s);if(c<1e-9)return l;let u=this.pixel(n,r,a,s+1);return l*(1-c)+u*c}sample(e,t){let n=this.spec.dLat,r=90-Math.floor((90-t)/n+1e-9)*n,i=(r-t)/n,a=this.along(r,e);return i<1e-9?a:a*(1-i)+this.along(r-n,e)*i}lonSpacing(e,t){let n=this.files.get(this.key(Math.ceil(e-1e-9)-1,Math.floor(t)))??[...this.files.values()].find(e=>e);return n?n.dLon:null}};function gg(e,t){let n=t/100*(e.length-1),r=Math.floor(n),i=n-r;return r+1<e.length?e[r]*(1-i)+e[r+1]*i:e[r]}function _g(e,t,n){let r=[];for(let n=0;n<e.length;n++)t[n]&&r.push(n);if(r.length===e.length||!r.length)return;let i=Uint8Array.from(t);for(;r.length;){let t=[];for(let a of r){let r=a/n|0,o=a%n;for(let s=-1;s<=1;s++)for(let c=-1;c<=1;c++){let l=r+s,u=o+c;if(l<0||u<0||l>=n||u>=n)continue;let d=l*n+u;i[d]||(i[d]=1,e[d]=e[a],t.push(d))}}r=t}}function vg(e,t,n){let r=e.length;for(let n=1,i=0;n<r;n++){let a=r>>1;for(;i&a;a>>=1)i^=a;i^=a,n<i&&([e[n],e[i]]=[e[i],e[n]],[t[n],t[i]]=[t[i],t[n]])}for(let i=2;i<=r;i<<=1){let a=(n?2:-2)*Math.PI/i,o=Math.cos(a),s=Math.sin(a);for(let n=0;n<r;n+=i){let r=1,a=0;for(let c=0;c<i/2;c++){let l=n+c,u=l+i/2,d=e[u]*r-t[u]*a,f=e[u]*a+t[u]*r;e[u]=e[l]-d,t[u]=t[l]-f,e[l]+=d,t[l]+=f;let p=r*o-a*s;a=r*s+a*o,r=p}}}}function yg(e,t,n,r){let i=new Float64Array(n),a=new Float64Array(n);for(let o=0;o<n;o++)i.set(e.subarray(o*n,o*n+n)),a.set(t.subarray(o*n,o*n+n)),vg(i,a,r),e.set(i,o*n),t.set(a,o*n);for(let o=0;o<n;o++){for(let r=0;r<n;r++)i[r]=e[r*n+o],a[r]=t[r*n+o];vg(i,a,r);for(let r=0;r<n;r++)e[r*n+o]=i[r],t[r*n+o]=a[r]}}function bg(e,t,n,r){let i=ru(t),a=new Float64Array(262144),o=new Float64Array(262144);for(let e=0;e<262144;e+=2){let t=Math.max(1e-12,i()),n=i(),r=Math.sqrt(-2*Math.log(t));a[e]=r*Math.cos(2*Math.PI*n),a[e+1]=r*Math.sin(2*Math.PI*n)}yg(a,o,512,!1);let s=e=>(e<256?e:e-512)/512;for(let e=0;e<512;e++)for(let t=0;t<512;t++){let i=Math.hypot(s(e),s(t))||1,c=e*512+t,l=i>=1/r&&i<=1/n?i**-1.8:0;a[c]*=l,o[c]*=l}yg(a,o,512,!0);let c=new Float32Array(e*e),l=0,u=0;for(let t=0;t<e;t++)for(let n=0;n<e;n++){let r=a[t%512*512+n%512];c[t*e+n]=r,l+=r,u+=r*r}let d=l/c.length,f=Math.sqrt(Math.max(0,u/c.length-d*d))+1e-12;for(let e=0;e<c.length;e++)c[e]/=f;return c}function xg(e,t){let n=Math.sqrt(3)-2,r=new Float64Array(t),i=()=>{for(let e=0;e<t;e++)r[e]*=6;let e=r[0],i=n;for(let a=1;a<Math.min(t,30);a++)e+=i*r[a],i*=n;r[0]=e;for(let e=1;e<t;e++)r[e]+=n*r[e-1];r[t-1]=n/(n*n-1)*(r[t-1]+n*r[t-2]);for(let e=t-2;e>=0;e--)r[e]=n*(r[e+1]-r[e])};for(let n=0;n<t;n++){for(let i=0;i<t;i++)r[i]=e[n*t+i];i();for(let i=0;i<t;i++)e[n*t+i]=r[i]}for(let n=0;n<t;n++){for(let i=0;i<t;i++)r[i]=e[i*t+n];i();for(let i=0;i<t;i++)e[i*t+n]=r[i]}}var Sg=e=>{let t=Math.abs(e);return t<1?2/3-t*t+t*t*t/2:t<2?(2-t)**3/6:0},Cg=class extends Error{},wg=()=>performance.now();async function Tg(e,t,n,r){let i=[],a=Math.floor(e),o=Math.floor(t),s=``;try{s=await mg(n)}catch(e){i.push(`Planetary Computer did not answer (${e.message}); the OpenTopography copy of GLO-30 is used.`)}if(s){let e=new hg(fg[`glo30-pc`],s);r(`Reading the Copernicus GLO-30 tile`);try{if(await e.openFile(a,o,n))return{dem:e,notes:i};let t=new hg(fg[`glo90-pc`],s);if(await t.openFile(a,o,n))return i.push(`GLO-30 has no public tile here; GLO-90 (3 arc-seconds) is used.`),{dem:t,notes:i};throw new Cg(`The Copernicus DEM has no land tile here: open sea, so there is no ground to drive on.`)}catch(e){if(e instanceof Cg||e.name===`AbortError`)throw e;i.push(`Planetary Computer failed (${e.message}); the OpenTopography copy of GLO-30 is used.`)}}let c=new hg(fg[`glo30-ot`],``);if(await c.openFile(a,o,n))return{dem:c,notes:i};throw new Cg(`No elevation tile could be read for this point (Planetary Computer and OpenTopography).`)}async function Eg(e,t,n,r,i=()=>{}){let a=wg(),{dem:o,notes:s}=await Tg(t,n,r,i),c=[...s],l=[[-1,-1],[-1,1],[1,-1],[1,1],[0,1],[0,-1],[1,0],[-1,0]].map(([e,r])=>cg(t,n,e*ag/2,r*ag/2)),u=l.map(e=>e[1]),d=l.map(e=>((e[0]-n+540)%360+360)%360-180);i(`Downloading elevation tiles`),await o.prefetch(Math.min(...u),Math.max(...u),n+Math.min(...d),n+Math.max(...d),r),i(`Building the ground`);let f=o.spec.resM,p=f<=1.5?2049:f<=3?1025:513,m=ig/(p-1),h=new Float32Array(p*p),g=new Uint8Array(p*p),_=0;for(let e=0;e<p;e++)for(let r=0;r<p;r++){let[i,a]=lg(t,n,ig,r*m,e*m),s=o.sample(i,a),c=e*p+r;Number.isFinite(s)&&(h[c]=s,g[c]=1,s===0&&_++)}let v=g.reduce((e,t)=>e+t,0),y=_/(p*p);if(v/(p*p)<.6)throw new Cg(`Only ${Math.round(100*v/(p*p))} % of the 2 km patch has elevation data here, so it cannot be simulated.`);if(y>.5)throw new Cg(`${Math.round(100*y)} % of the 2 km patch is at exactly 0 m in the DEM, where it flattens the sea: this is open water, not ground.`);{let e=new Float64Array(v),t=0;for(let n=0;n<h.length;n++)g[n]&&(e[t++]=h[n]);e.sort();let n=gg(e,.5),r=gg(e,50),i=gg(e,99.5),a=0;for(let e=0;e<h.length;e++)g[e]&&Math.abs(h[e]-r)>6*(i-n)+50&&(g[e]=0,a++);a&&c.push(`${a} outlier samples removed and filled from their neighbours`),v-=a}let b=v/(p*p);_g(h,g,p),b<.999&&c.push(`elevation: ${(100*(1-b)).toFixed(1)} % of the patch had no data and was filled from the nearest data`),y>.02&&c.push(`${Math.round(100*y)} % of the patch is at exactly 0 m in the DEM (sea or water flattened by the DEM)`);let x=ru(nu(e+`|truth`)),S=[];for(let e=0;e<48;e++){let e=40+x()*1920,r=40+x()*1920,[i,a]=lg(t,n,ig,e,r),s=o.sample(i,a);Number.isFinite(s)&&S.push({x:e,z:r,lon:i,lat:a,h:s})}let C=f>5,w=0;if(C){let r=Math.max(8,Math.round(ig/f)+1),i=ig/(r-1),a=new Float32Array(r*r),s=new Uint8Array(r*r);for(let e=0;e<r;e++)for(let c=0;c<r;c++){let[l,u]=lg(t,n,ig,c*i,e*i),d=o.sample(l,u);Number.isFinite(d)&&(a[e*r+c]=d,s[e*r+c]=1)}_g(a,s,r);let c=Float64Array.from(a);xg(c,r);let l=e=>Math.max(0,Math.min(r-1,e)),u=e=>e*(r-1)/(p-1),d=new Float64Array(r*(r-1));for(let e=0,t=0;e<r;e++)for(let n=0;n<r-1;n++)d[t++]=Math.abs(a[e*r+n+1]-a[e*r+n]);d.sort();let g=r>2?gg(d,50):.5;w=Math.min(.07,Math.max(.03,.05*g));let _=f/m,v=bg(p,nu(e),2,Math.max(4,2*_));for(let e=0;e<p;e++){let t=u(e),n=Math.floor(t),i=t-n;for(let t=0;t<p;t++){let o=u(t),s=Math.floor(o),d=o-s,f=0;for(let e=-1;e<=2;e++){let t=Sg(i-e);if(t)for(let i=-1;i<=2;i++){let a=Sg(d-i);a&&(f+=t*a*c[l(n+e)*r+l(s+i)])}}let m=l(n+1),g=l(s+1),_=l(n),y=l(s),b=a[_*r+y]*(1-d)*(1-i)+a[_*r+g]*d*(1-i)+a[m*r+y]*(1-d)*i+a[m*r+g]*d*i,x=e*p+t;h[x]=h[x]+Math.max(-.25,Math.min(.25,f-b))+Math.max(-.2,Math.min(.2,w*v[x]))}}}let T=ag/160,E=Math.max(1,Math.floor(T/f+1e-6)),D=new Float32Array(25921),O=new Uint8Array(25921),k=[];for(let e=0;e<E;e++)k.push((e-(E-1)/2)*o.spec.dLat);for(let e=0;e<161;e++)for(let r=0;r<161;r++){let[i,a]=lg(t,n,ag,r*T,e*T),s=o.lonSpacing(a,i)??o.spec.dLat,c=0,l=0;for(let e of k)for(let t of k){let n=o.sample(i+t/o.spec.dLat*s,a+e);Number.isFinite(n)&&(c+=n,l++)}l===k.length*k.length&&(D[e*161+r]=c/l,O[e*161+r]=1)}let A=O.reduce((e,t)=>e+t,0)/O.length;if(A<.02){let e=Float64Array.from(h).sort();D.fill(gg(e,50)),O.fill(0),A=0,c.push(`context ring: no elevation beyond the patch (flat ring shown)`)}let j=Math.round(4e3/T),ee=Math.round(6e3/T),M=(p-1)/32;for(let e=j;e<=ee;e++)for(let t=j;t<=ee;t++)D[e*161+t]=h[Math.round((e-j)*M)*p+Math.round((t-j)*M)],O[e*161+t]=1;_g(D,O,161),A<.98&&c.push(`context ring: the source covers ${Math.round(100*A)} % of the 10 km ring; the rest is filled from the nearest data`);let N=1/0;for(let e=0;e<h.length;e++)h[e]<N&&(N=h[e]);for(let e=0;e<h.length;e++)h[e]-=N;for(let e=0;e<D.length;e++)D[e]-=N;let te=o.lonSpacing(t,n),ne={elevation_source:o.spec.label,elevation_source_id:o.spec.id,elevation_resolution_m:f,spacing_ns_m:o.spec.dLat*sg*og,spacing_ew_m:te?te*sg*og*Math.cos(t*sg):null,imagery_source:`none`,imagery_resolution_m:null,synthetic_fine:C,fine_detail_rms_m:Math.round(w*1e3)/1e3,date_built:new Date().toISOString(),site_center:[t,n],hmin:N,datum:`EGM2008 geoid (Copernicus DEM heights), lowest point of the patch = 0 m`,valid:Math.round(b*1e4)/1e4,ctx:{n:161,size_m:ag,src:o.spec.label,valid:Math.round(A*1e3)/1e3},sea_frac:y,missing:c,licence:[`Copernicus DEM: © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018, provided under COPERNICUS by the European Union and ESA; all rights reserved`],bytes:o.bytes(),ms:Math.round(wg()-a),truth:S};return{fine:{M:p,h,size:ig},ctx:{n:161,h:D,size:ag},prov:ne}}var Dg=.7,Og=250,kg={soil:.5,dust:.5,cls:`fine_regolith`,fromGrid:!1};async function Ag(e,n){let r=null;try{r=await t()}catch{}let i=r?s(r,e,n):null,a=i?.measures.lithology??null,c=a?o[a]:null;if(!i||!c||!c.minerals){let e=r?i?a===`ig`?`the cell is mapped as glacier ice, which the soil model has no class for`:`the cell's rock class is "${c?.label??`none`}"`:`no land cell of the 0.5° grid here`:`the global grid could not be loaded`;return{...kg,tempK:i?.measures.tmean??null,cellCentre:i?[i.lat,i.lon]:null,rows:[{field:`Soil competence`,value:kg.soil.toFixed(2),how:`assumed`,basis:`Default, because ${e}.`},{field:`Ground class`,value:`Fine regolith`,how:`assumed`,basis:`Default class of the old model for competence 0.5 and dust 0.5.`}]}}let l=c.loose??0,u=Math.round((1-l)*100)/100,d=i.measures.precipitation,f=u>=Dg?`rocky`:d<Og?`sand`:`fine_regolith`,p=Math.max(0,Math.min(1,(Math.log10(800)-Math.log10(Math.max(d,2)))/(Math.log10(800)-Math.log10(2))));return{soil:u,dust:Math.round(p*100)/100,cls:f,fromGrid:!0,tempK:i.measures.tmean,cellCentre:[i.lat,i.lon],rows:[{field:`Rock class`,value:c.label,how:`from the grid`,basis:`GLiM, dominant class of the 0.5° cell (about 50 km).`},{field:`Rainfall`,value:`${Math.round(d)} mm a year`,how:`from the grid`,basis:`NASA POWER climatology of the cell.`},{field:`Soil competence`,value:u.toFixed(2),how:`from the grid by rule`,basis:`1 − looseness of the rock class (${l.toFixed(2)}, the same value scoring.ts uses for loose ground). A rule, not a measurement of the ground.`},{field:`Ground class`,value:f===`rocky`?`Rocky, firm ground`:f===`sand`?`Sand`:`Fine regolith`,how:`from the grid by rule`,basis:`Competence ${Dg} or more is firm ground (the old model's threshold); otherwise sand below ${Og} mm of rain a year and fine-grained soil above. A rule, not a soil map.`},{field:`Dust kicked up`,value:p.toFixed(2),how:`from the grid by rule`,basis:`Dryness from rainfall; changes only how much dust is drawn behind the wheels.`},{field:`Soil wetness`,value:i.measures.soilWetness==null?`none`:i.measures.soilWetness.toFixed(2),how:`from the grid`,basis:`Shown, not used: the model has no relation between wetness and traction.`}]}}var jg={esri:{label:`Esri World Imagery`,sourceRes:null,maxZoom:18,tile:(e,t,n)=>`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${e}/${n}/${t}?blankTile=false`,attribution:`Imagery © Esri, Vantor (Maxar), Earthstar Geographics, and the GIS User Community`,short:`© Esri, Vantor, Earthstar Geographics`,terms:`Esri Master License Agreement.`},sentinel:{label:`Sentinel-2 cloudless 2020 (EOX)`,sourceRes:10,maxZoom:15,tile:(e,t,n)=>`https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/${e}/${n}/${t}.jpg`,attribution:`Sentinel-2 cloudless - https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2020)`,short:`Sentinel-2 cloudless © EOX (Copernicus data)`,terms:`CC BY-NC-SA 4.0 for non-commercial use (EOX licence summary); commercial use needs EOX's commercial licence.`}},Mg=156543.03392804097;async function Ng(e,t){let n=await fetch(e,{signal:t});if(n.status===404)return null;if(!n.ok)throw Error(`HTTP ${n.status}`);let r=await n.blob();return{img:await createImageBitmap(r),bytes:r.size}}async function Pg(e,t,n,r,i,a,o){let s=jg[e];a=Math.min(s.maxZoom,a);let c=new Float64Array(1089),l=new Float64Array(1089),u=1/0,d=-1/0,f=1/0,p=-1/0;for(let e=0;e<33;e++)for(let i=0;i<33;i++){let[o,s]=lg(t,n,r,i/32*r,e/32*r),m=Math.sin(s*Math.PI/180),h=(o+180)/360*256*2**a,g=(.5-Math.log((1+m)/(1-m))/(4*Math.PI))*256*2**a;c[e*33+i]=h,l[e*33+i]=g,u=Math.min(u,h),d=Math.max(d,h),f=Math.min(f,g),p=Math.max(p,g)}let m=Math.floor(u/256),h=Math.floor(d/256),g=Math.floor(f/256),_=Math.floor(p/256),v=(h-m+1)*256,y=(_-g+1)*256,b=document.createElement(`canvas`);b.width=v,b.height=y;let x=b.getContext(`2d`,{willReadFrequently:!0}),S=0,C=0,w=0,T=[];for(let e=g;e<=_;e++)for(let t=m;t<=h;t++)T.push((async()=>{w++;for(let n=0;n<=3;n++){let r=2**n,i=await Ng(s.tile(a-n,Math.floor(t/r),Math.floor(e/r)),o);if(!i)continue;S+=i.bytes;let c=256/r;x.drawImage(i.img,t%r*c,e%r*c,c,c,(t-m)*256,(e-g)*256,256,256),i.img.close(),n&&C++;return}C++})());if(await Promise.all(T),C===w)return null;let E=x.getImageData(0,0,v,y).data,D=document.createElement(`canvas`);D.width=D.height=i;let O=D.getContext(`2d`),k=O.createImageData(i,i),A=k.data;for(let e=0;e<i;e++){let t=(e+.5)/i*32,n=Math.min(31,Math.floor(t)),r=t-n;for(let t=0;t<i;t++){let a=(t+.5)/i*32,o=Math.min(31,Math.floor(a)),s=a-o,u=n*33+o,d=(c[u]*(1-s)+c[u+1]*s)*(1-r)+(c[u+33]*(1-s)+c[u+33+1]*s)*r,f=(l[u]*(1-s)+l[u+1]*s)*(1-r)+(l[u+33]*(1-s)+l[u+33+1]*s)*r,p=Math.min(v-1,Math.max(0,Math.floor(d-m*256))),h=(Math.min(y-1,Math.max(0,Math.floor(f-g*256)))*v+p)*4,_=(e*i+t)*4;A[_]=E[h],A[_+1]=E[h+1],A[_+2]=E[h+2],A[_+3]=255}}O.putImageData(k,0,0);let j=Mg*Math.cos(t*Math.PI/180)/2**a;return{canvas:D,zoom:a,tilePixelM:j,pixelM:r/i,tiles:w,missing:C,bytes:S}}var Fg=(e,t)=>Math.max(1,Math.round(Math.log2(Mg*Math.cos(e*Math.PI/180)/t))),Ig=`/Nasa_space_app/rover/targets/`,Lg=async(e,t)=>{let n=await fetch(Ig+e,{signal:t});if(!n.ok)throw Error(`${e}: HTTP ${n.status}`);return n.arrayBuffer()};async function Rg(e){return new Uint8Array(await new Response(new Blob([e]).stream().pipeThrough(new DecompressionStream(`gzip`))).arrayBuffer())}var zg=null;function Bg(e=Lg){if(!zg||e!==Lg){let t=e(`targets.json`).then(e=>JSON.parse(new TextDecoder().decode(e)));if(e!==Lg)return t;zg=t.catch(e=>{throw zg=null,e})}return zg}var Vg={"mars-modern":{targetId:`mars_gale`},"mars-wet":{targetId:`mars_jezero`},"mars-sulfate":{targetId:`mars_gale`,area:`Mount Sharp sulfate unit`},"mars-volcanic":{targetId:`mars_jezero`,area:`volcanic crater floor`},"mars-polar":{targetId:`mars_gale`,closest:!0},"moon-maria":{targetId:`moon_a11`},"moon-highlands":{targetId:`moon_a11`,closest:!0},"moon-pole":{targetId:`moon_sp`}};function Hg(e,t,n){return e.startsWith(`moon-custom-`)?n!=null&&n<-75?{targetId:`moon_sp`}:{targetId:`moon_a11`,closest:void 0}:Vg[e]??{targetId:t===`moon`?`moon_a11`:`mars_gale`,closest:!0}}function Ug(e,t){let n=t.body===`moon`?`Moon`:`Mars`,r=e.closest?` (closest available)`:e.area?` (${e.area})`:``;return`${n} ground: ${t.name}${r} · ${t.gravity} m/s²`}async function Wg(e,t={}){let n=t.read??Lg,r=await Bg(n),i=r.targets.find(t=>t.id===e);if(!i)throw Error(`no target ${e} in targets.json`);let a=r.patches[i.patch];if(!a)throw Error(`no patch ${i.patch} in targets.json`);let o={...a,id:i.patch,synthetic_fine:!a.real||a.real.fine_detail_rms_m>0};if(a.real){let e=a.real,[r,s]=await Promise.all([n(`${e.dir}fine.h16`,t.signal).then(Rg),n(`${e.dir}ctx.h16`,t.signal).then(Rg)]),c=tu(r,e.n,e.hscale),l=tu(s,e.ctx.n,e.hscale),u=1/0;for(let e=0;e<c.length;e++)c[e]<u&&(u=c[e]);for(let e=0;e<c.length;e++)c[e]-=u;for(let e=0;e<l.length;e++)l[e]-=u;let d=lu(i.patch,a.n,{M:e.n,h:c,size:a.size_m},{n:e.ctx.n,size:e.ctx.size_m,h:l},o);return d.kind=`target`,{target:i,patch:d}}if(!a.base)throw Error(`patch ${i.patch} has no height file`);let s=await n(a.base.file,t.signal);if(s.byteLength<a.n*a.n*2)throw Error(`${a.base.file}: ${s.byteLength} bytes, expected ${a.n*a.n*2}`);let c=new DataView(s),l=new Float32Array(a.n*a.n);for(let e=0;e<l.length;e++)l[e]=c.getUint16(e*2,!0)*a.hscale;return{target:i,patch:cu(i.patch,a.n,a.size_m,l,`target`,{synthetic:!0,syntheticBase:!0,prov:o})}}var Gg=e({openRoverSim:()=>Jg}),Kg=e=>e.replace(/[&<>"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`})[e]),qg=null;async function Jg(e){qg&&await qg.close();let{place:t,target:n}=e,r=document.getElementById(`root`),i=document.createElement(`div`);i.className=`rsim`,i.setAttribute(`role`,`dialog`),i.setAttribute(`aria-modal`,`true`),i.setAttribute(`aria-label`,`Rover simulation at ${t.name}`),document.body.appendChild(i),r&&(r.inert=!0);let a=new AbortController,o=!1,s=async()=>{if(!o){o=!0,a.abort();try{await dh()}catch(e){console.error(e)}i.remove(),r&&(r.inert=!1),qg=null,delete window.__rsim,e.onExit()}},c={close:s};qg=c,i.innerHTML=`<div class="rs-load" role="status" aria-live="polite"><div class="rs-load-box"><div class="veil-kicker">Rover simulation</div><div class="rs-load-title">${Kg(t.name)}</div><div class="rs-spin" aria-hidden="true"></div><div class="rs-load-sub" id="rsStatus">Preparing</div><button class="btn ghost" id="rsCancel">Back to globe</button></div></div>`;let l=e=>{let t=i.querySelector(`#rsStatus`);t&&(t.textContent=e)};i.querySelector(`#rsCancel`).addEventListener(`click`,()=>void s());let u=e=>{if(o)return;i.innerHTML=`<div class="rs-load" role="alert"><div class="rs-load-box"><div class="veil-kicker">Rover simulation</div><div class="rs-load-title">${Kg(t.name)}</div><p class="rs-load-error">This place cannot be simulated. ${Kg(e)}</p><button class="btn" id="rsBack">Back to globe</button></div></div>`;let n=i.querySelector(`#rsBack`);n.addEventListener(`click`,()=>void s()),n.focus()};try{let r=`pt_${t.lat.toFixed(5)}_${t.lon.toFixed(5)}`,u=fetch(`/Nasa_space_app/rover/assets/models/rovers.json`,{signal:a.signal}).then(e=>e.ok?e.json():null).catch(()=>null),d=Ag(t.lat,t.lon),f=Eg(r,t.lat,t.lon,a.signal,l),p=(async()=>{if(e.imagery===`none`)return null;let n=jg[e.imagery];try{let r=Math.min(n.maxZoom,Fg(t.lat,1)),i=156543.03392804097*Math.cos(t.lat*Math.PI/180)/2**r,o=Math.min(2048,2**Math.ceil(Math.log2(Math.max(256,ig/Math.max(i,n.sourceRes??0))))),s=(n.sourceRes??i)<=5?1024:512,[c,l]=await Promise.all([Pg(e.imagery,t.lat,t.lon,ig,o,r,a.signal),Pg(e.imagery,t.lat,t.lon,ag,s,Math.min(n.maxZoom,Fg(t.lat,ag/s)),a.signal)]);return c?{spec:n,img:c,ctx:l}:null}catch(e){if(e.name===`AbortError`)throw e;return console.error(e),{spec:n,img:null,ctx:null,error:e.message}}})(),m=Hg(n.id,n.body,n.lat),h=Wg(m.targetId,{signal:a.signal}).then(e=>({...e,choice:m,title:Ug(m,e.target)}),e=>{if(e.name===`AbortError`)throw e;return console.error(e),null}),[g,_,v,y,b]=await Promise.all([u,d,f,p,h]);if(o)return c;eu.rovers=g;let x=v.prov;y&&y.img?(x.imagery_source=y.spec.label,x.imagery_resolution_m=y.img.tilePixelM,y.img.missing&&x.missing.push(`imagery: ${y.img.missing} of ${y.img.tiles} tiles were not available at zoom ${y.img.zoom} and were enlarged from a lower zoom`)):y&&`error`in y?x.missing.push(`imagery: ${y.spec.label} could not be loaded (${y.error}); the generic ground texture is shown`):e.imagery!==`none`&&x.missing.push(`imagery: ${jg[e.imagery].label} has no tiles here; the generic ground texture is shown`);let S=lu(r,129,v.fine,v.ctx,x),C=(g?.gravity_mps2??{moon:1.62,mars:3.71})[n.body],w={place:t,target:{...n,gravity:C,bodyName:n.body===`moon`?`Moon`:`Mars`},soil:_,traits:{soil:_.soil,dust:_.dust,temp_mean:_.tempK??288},prov:x,similarity:e.similarity??null};i.querySelector(`.rs-load`)?.remove(),await sh({host:i,ctx:w,patch:S,imagery:y&&y.img?y:null,targetGround:b,onBack:()=>void s()}),window.__rsim={patch:S,prov:x,ctx:w,imagery:y,targetGround:b};let T=Pd();T&&Yg(T,a.signal).catch(e=>console.error(`benchmark failed`,e))}catch(e){if(o||e.name===`AbortError`)return c;console.error(e),u(e instanceof Cg?e.message:`The ground could not be built: ${e.message}.`)}return c}async function Yg(e,t){let n=window,r=e=>new Promise(t=>setTimeout(t,e)),i=async(e,n=24e4)=>{let i=performance.now();for(;!e();){if(t.aborted)throw Error(`simulator closed`);if(performance.now()-i>n)throw Error(`benchmark timed out`);await r(100)}};await i(()=>n.TERRA_SITE&&n.TERRA_SITE.open&&n.TERRA_SITE.runs),await r(1500);let a=n.TERRA_SITE;if(e===`drive`){document.getElementById(`driveBtn`).click(),await i(()=>!document.getElementById(`driveChooser`).classList.contains(`hidden`)),document.querySelector(`#dcCards .dc-pick`).click(),await i(()=>n.TERRA_DRIVE&&n.TERRA_DRIVE.active),n.TERRA_BENCH_INPUT=e=>({throttle:1,steer:Math.sin(e*.35)*.6,brake:0});try{return await Fd(`drive`)}finally{n.TERRA_BENCH_INPUT=null}}let o=!0,s=a.cams[0],c=()=>{if(!o||t.aborted||!a.open)return;let e=s.controls.target,n=s.camera.position.x-e.x,r=s.camera.position.z-e.z,i=.006;s.camera.position.x=e.x+n*Math.cos(i)-r*Math.sin(i),s.camera.position.z=e.z+n*Math.sin(i)+r*Math.cos(i),s.controls.update(),a.dirty=0,a.awake=performance.now()+1e9,requestAnimationFrame(c)};requestAnimationFrame(c);try{return await Fd(`site`)}finally{o=!1,a.awake=0}}export{U as C,H as D,br as E,W as S,ut as T,uu as _,km as a,Pn as b,Ld as c,Pu as d,Mu as f,fu as g,yu as h,Yh as i,od as l,Nu as m,qh as n,Uf as o,Jg as openRoverSim,wu as p,Jh as r,Y as s,Gg as t,Su as u,mu as v,ks as w,Gn as x,eu as y};