// shared by css generator + board builder
const mix=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('').toUpperCase()};
const P={
 sagerose:{day:{ground:'#E3EADF',sheet:'#EEF3EA',madder:'#55725D',onm:'#F8F3EA',accent:'#A64E62',ink:'#232E27',muted:'#4A5850',line:'#8FA896',lineT:.47,btn:'#2F4636',field:'#D3DDCF',olive:'#3F6B4C'},
           night:{ground:'#1B2A23',sheet:'#25362D',madder:'#4A6A55',onm:'#F4F0E6',accent:'#EBAFBA',ink:'#EDF1E8',muted:'#A9B8AD',line:'#EBAFBA',lineT:.24,btn:'#2B4636',field:'#22332A',olive:'#A9C9A0'}},
 powder:{day:{ground:'#E2E9F2',sheet:'#EDF2F8',madder:'#557594',onm:'#FFFFFF',accent:'#A8536C',ink:'#1F2A38',muted:'#475567',line:'#8FA9C8',lineT:.20,btn:'#2D4864',field:'#D2DCE9',olive:'#3F6A5C'},
          night:{ground:'#19253A',sheet:'#223250',madder:'#38567A',onm:'#F2F6FB',accent:'#F1B9C4',ink:'#E9F0F8',muted:'#A5B4C8',line:'#A9C3E4',lineT:.11,btn:'#27415F',field:'#1F2D45',olive:'#A8CDB8'}},
 mughal:{day:{ground:'#EFDFE6',sheet:'#F8EEF2',madder:'#85495D',onm:'#FFF7F4',accent:'#4F7A63',ink:'#2E1F25',muted:'#5C4850',line:'#CBA0AC',lineT:.50,btn:'#5C2E40',field:'#E3D2DA',olive:'#456E57'},
          night:{ground:'#1F2D2B',sheet:'#2A3B38',madder:'#7A4A63',onm:'#FAF0F2',accent:'#A8D2B8',ink:'#EEF3EE',muted:'#AFC2BA',line:'#E2B3C3',lineT:.24,btn:'#4A2438',field:'#25352F',olive:'#A8D2B8'}},
 crewel:{day:{ground:'#EBEEE4',sheet:'#F4F6EF',madder:'#44697C',onm:'#F6F9F8',accent:'#A6566A',ink:'#1F2B30',muted:'#46565C',line:'#86A5B8',lineT:.48,btn:'#2A4756',field:'#DCE2D6',olive:'#476B52'},
          night:{ground:'#1B2B33',sheet:'#25383F',madder:'#3C6479',onm:'#F2F7F6',accent:'#F2B7A9',ink:'#EAF1EE',muted:'#A3B6B9',line:'#A6C8D6',lineT:.24,btn:'#234556',field:'#213239',olive:'#A6CDB0'}},
 iznik:{day:{ground:'#E1ECEC',sheet:'#ECF4F4',madder:'#2F7482',onm:'#F3FAFA',accent:'#B3523F',ink:'#1B2C30',muted:'#43585C',line:'#7FB3B8',lineT:.48,btn:'#1B4B56',field:'#D0E0E0',olive:'#3F6B4C'},
         night:{ground:'#17303A',sheet:'#203F4B',madder:'#2B6F7E',onm:'#F1F9F9',accent:'#F3AB9B',ink:'#E8F3F2',muted:'#9FBBC0',line:'#9ED2D8',lineT:.24,btn:'#17454F',field:'#1C3843',olive:'#A8D1B0'}},
 lilac:{day:{ground:'#ECE7F2',sheet:'#F5F2F9',madder:'#6A5590',onm:'#FAF6FD',accent:'#A24E78',ink:'#262034',muted:'#51485F',line:'#B5A5D2',lineT:.50,btn:'#3F2E5E',field:'#DED7E8',olive:'#4D6B50'},
        night:{ground:'#211B33',sheet:'#2C2542',madder:'#5C4A86',onm:'#F8F2FC',accent:'#F3BBA6',ink:'#EDE8F4',muted:'#B0A6C2',line:'#C3B2E4',lineT:.24,btn:'#3A2A5A',field:'#272039',olive:'#B3D0A6'}},
};

const OV={
 powder_v1:{day:{ground:'#E1EBEE',sheet:'#ECF3F4',field:'#D1DFE2',madder:'#3D7075',onm:'#FFFFFF',accent:'#2B7A72',ink:'#1C2F36',muted:'#46595F',line:'#8FB8B8',btn:'#22494D',olive:'#2D6B57'},
  night:{ground:'#16282E',sheet:'#1E353C',field:'#1B3138',madder:'#2D5A5F',onm:'#F0F7F6',accent:'#8FD3C3',ink:'#E6F1F0',muted:'#A3B8B8',line:'#9FCFC8',btn:'#1F4246',olive:'#A6D8BD'}},
 powder_v2:{day:{ground:'#E3E7F1',sheet:'#EEF0F8',field:'#D5DAEA',madder:'#4A5A8C',onm:'#FFFFFF',accent:'#4A5A8C',ink:'#1E2540',muted:'#4A5170',line:'#95A2CF',btn:'#2C3763',olive:'#34695A'},
  night:{ground:'#171E36',sheet:'#212A4A',field:'#1D2540',madder:'#3A4A7A',onm:'#F0F3FB',accent:'#B5C2EC',ink:'#E8ECF8',muted:'#A9B2CF',line:'#A5B3E0',btn:'#2A3560',olive:'#A9D6C0'}},
 powder_v3:{day:{ground:'#E2E8F2',sheet:'#EDF1F8',field:'#D3DBEA',madder:'#4A5A8C',onm:'#FFFFFF',accent:'#2B7A72',ink:'#1E2540',muted:'#4A5170',line:'#93A6C8',bordLine:'#7FB8B0',btn:'#2C3763',olive:'#2D6B57'},
  night:{ground:'#171F38',sheet:'#212B4C',field:'#1D2642',madder:'#3A4A7A',onm:'#F0F3FB',accent:'#8FD3C3',ink:'#E8EDF8',muted:'#A9B3CF',line:'#A9B8E2',bordLine:'#8FCDC3',btn:'#2A3560',olive:'#A6D8BD'}}};
for(const [k,o] of Object.entries(OV)){P[k]={};for(const m of ['day','night'])P[k][m]=Object.assign({},P.powder[m],o[m]);}
module.exports={P,mix};
