import{r as d,q as ae,u as le,j as e,C as p,b as de,T as ce,f as r,d as S,e as c,g as y,t as $,v as A,I as he,E,M as k,p as b,D as me,S as M,w as z,x as u,y as pe,s as G}from"./index-bcuI966E.js";import{h as o}from"./moment-C5S46NFB.js";import{R as L}from"./ClockCircleOutlined-Cahcm4Ws.js";import{R as xe}from"./SearchOutlined-D2gRiFxI.js";import{S as F}from"./index-COd8B_t3.js";import{D as ge}from"./index-BexZ__8y.js";import{F as ue}from"./Table-BovAFv33.js";import{I as O}from"./index-Cj-YuFRM.js";import{D as a}from"./index-C9OcwkKB.js";import{R as ve}from"./index-Ciy63vs3.js";import{R as q}from"./DownloadOutlined-tzrggLxe.js";import{R as W}from"./DeleteOutlined-CNMFFws8.js";import"./ClockCircleOutlined-CELcQ7Uv.js";import"./DownOutlined-DeH2MZMn.js";import"./dayjs.min-B6KFzVi6.js";import"./addEventListener-CwuRzLNG.js";import"./Pagination-KlOrN12m.js";import"./DownloadOutlined-DTidZHln.js";var fe={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M820 436h-40c-4.4 0-8 3.6-8 8v40c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-40c0-4.4-3.6-8-8-8zm32-104H732V120c0-4.4-3.6-8-8-8H300c-4.4 0-8 3.6-8 8v212H172c-44.2 0-80 35.8-80 80v328c0 17.7 14.3 32 32 32h168v132c0 4.4 3.6 8 8 8h424c4.4 0 8-3.6 8-8V772h168c17.7 0 32-14.3 32-32V412c0-44.2-35.8-80-80-80zM360 180h304v152H360V180zm304 664H360V568h304v276zm200-140H732V500H292v204H160V412c0-6.6 5.4-12 12-12h680c6.6 0 12 5.4 12 12v292z"}}]},name:"printer",theme:"outlined"};function Y(){return Y=Object.assign?Object.assign.bind():function(n){for(var l=1;l<arguments.length;l++){var g=arguments[l];for(var m in g)Object.prototype.hasOwnProperty.call(g,m)&&(n[m]=g[m])}return n},Y.apply(this,arguments)}const je=(n,l)=>d.createElement(ae,Y({},n,{ref:l,icon:fe})),C=d.forwardRef(je),{Title:D,Paragraph:X,Text:h}=ce,{Option:w}=F,{RangePicker:ye}=ge,v=[{id:"BK001",movie:"Spider-Man: No Way Home",moviePoster:"https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",cinema:"CGV Vincom Đồng Khởi",cinemaAddress:"Tầng 3, Vincom Center, 72 Lê Thánh Tôn, Q.1",room:"Phòng 2",seats:["G7","G8"],showtime:"2024-12-01T14:30:00",bookingDate:"2024-11-28T10:15:00",quantity:2,totalPrice:2e5,status:"completed",paymentMethod:"Thẻ tín dụng",hasReviewed:!0,rating:5},{id:"BK002",movie:"Dune: Part Two",moviePoster:"https://image.tmdb.org/t/p/w500/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg",cinema:"Lotte Cinema Landmark 81",cinemaAddress:"Tầng 4-5, Vincom Landmark 81, Vinhomes Central Park",room:"Phòng IMAX",seats:["E5","E6"],showtime:"2024-12-15T19:00:00",bookingDate:"2024-12-10T16:30:00",quantity:2,totalPrice:3e5,status:"upcoming",paymentMethod:"Ví điện tử",hasReviewed:!1},{id:"BK003",movie:"Avatar: The Way of Water",moviePoster:"https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",cinema:"Galaxy Cinema Nguyễn Du",cinemaAddress:"Số 116 Nguyễn Du, Q.1",room:"Phòng 3D",seats:["H10"],showtime:"2024-11-20T16:45:00",bookingDate:"2024-11-18T14:20:00",quantity:1,totalPrice:12e4,status:"cancelled",paymentMethod:"Thẻ ATM",refundAmount:1e5,hasReviewed:!1}],be=({ticket:n})=>n?e.jsxs("div",{style:{background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",borderRadius:"12px",padding:"24px",color:"white",position:"relative",overflow:"hidden"},children:[e.jsxs("div",{style:{textAlign:"center",marginBottom:"20px",borderBottom:"2px dashed rgba(255,255,255,0.3)",paddingBottom:"16px"},children:[e.jsx("h2",{style:{color:"white",margin:"0 0 8px 0",fontSize:"24px"},children:"HOT CINEMAS"}),e.jsx("p",{style:{margin:0,fontSize:"14px",opacity:.9},children:"VÉ XEM PHIM ĐIỆN TỬ"})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"20px"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{marginBottom:"8px"},children:e.jsx("strong",{style:{fontSize:"16px"},children:n.movie})}),e.jsxs("div",{style:{fontSize:"14px",opacity:.9},children:["📍 ",n.cinema]}),e.jsx("div",{style:{fontSize:"12px",opacity:.8,marginTop:"4px"},children:n.cinemaAddress})]}),e.jsxs("div",{style:{textAlign:"right"},children:[e.jsxs("div",{style:{fontSize:"14px",marginBottom:"4px"},children:["📅 ",o(n.showtime).format("DD/MM/YYYY")]}),e.jsxs("div",{style:{fontSize:"14px",marginBottom:"4px"},children:["🕐 ",o(n.showtime).format("HH:mm")]}),e.jsxs("div",{style:{fontSize:"14px"},children:["🎬 ",n.room]})]})]}),e.jsx("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:"8px",padding:"16px",marginBottom:"16px"},children:e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"12px",opacity:.8,marginBottom:"4px"},children:"GHẾ NGỒI"}),e.jsx("div",{style:{fontSize:"18px",fontWeight:"bold"},children:n.seats.join(", ")})]}),e.jsxs("div",{style:{textAlign:"right"},children:[e.jsx("div",{style:{fontSize:"12px",opacity:.8,marginBottom:"4px"},children:"TỔNG TIỀN"}),e.jsxs("div",{style:{fontSize:"18px",fontWeight:"bold"},children:[n.totalPrice.toLocaleString("vi-VN")," VNĐ"]})]})]})}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",fontSize:"12px"},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{opacity:.8},children:["Mã vé: ",e.jsx("strong",{children:n.id})]}),e.jsxs("div",{style:{opacity:.8},children:["Số lượng: ",n.quantity," vé"]})]}),e.jsxs("div",{style:{textAlign:"right"},children:[e.jsxs("div",{style:{opacity:.8},children:["Ngày đặt: ",o(n.bookingDate).format("DD/MM/YYYY")]}),e.jsxs("div",{style:{opacity:.8},children:["Thanh toán: ",n.paymentMethod]})]})]}),e.jsx("div",{style:{position:"absolute",top:"20px",right:"20px",width:"60px",height:"60px",background:"white",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",color:"#333",textAlign:"center"},children:"QR"}),e.jsxs("div",{style:{marginTop:"20px",paddingTop:"16px",borderTop:"1px dashed rgba(255,255,255,0.3)",textAlign:"center",fontSize:"10px",opacity:.8},children:[e.jsx("p",{style:{margin:"0 0 4px 0"},children:"Vui lòng có mặt tại rạp trước 15 phút"}),e.jsx("p",{style:{margin:"0 0 4px 0"},children:"Hotline: 1900-6017 | Website: hotcinemas.vn"}),e.jsxs("p",{style:{margin:0},children:["Xem vé lúc: ",o().format("DD/MM/YYYY HH:mm:ss")]})]})]}):null,Ee=()=>{const{isAuthenticated:n}=le(),[l,g]=d.useState(""),[m,K]=d.useState(null),[x,Q]=d.useState(null),[_,f]=d.useState(!1),[s,J]=d.useState(null),[U,j]=d.useState(!1),[T,Z]=d.useState(null),V=d.useMemo(()=>v.filter(t=>{if(l){const i=l.toLowerCase();if(!t.movie.toLowerCase().includes(i)&&!t.cinema.toLowerCase().includes(i)&&!t.id.toLowerCase().includes(i))return!1}return!(m&&t.status!==m||x&&x.length===2&&!o(t.bookingDate).isBetween(x[0],x[1],"day","[]"))}),[l,m,x]),R=t=>{switch(t){case"completed":return"green";case"upcoming":return"blue";case"cancelled":return"red";case"expired":return"orange";default:return"default"}},H=t=>{switch(t){case"completed":return"Đã hoàn thành";case"upcoming":return"Sắp chiếu";case"cancelled":return"Đã hủy";case"expired":return"Đã hết hạn";default:return"Không xác định"}},ee=t=>{J(t),f(!0)},P=t=>{Z(t),j(!0)},I=t=>{const i=window.open("","_blank"),oe=`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Vé xem phim - ${t.id}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        background: #f5f5f5;
                    }
                    .ticket {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        max-width: 400px;
                        margin: 0 auto;
                        border-radius: 12px;
                        padding: 24px;
                        position: relative;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px dashed rgba(255,255,255,0.3);
                        padding-bottom: 16px;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        margin: 0 0 8px 0;
                        font-size: 24px;
                    }
                    .header p {
                        margin: 0;
                        font-size: 14px;
                        opacity: 0.9;
                    }
                    .content {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    .movie-info h2 {
                        margin: 0 0 8px 0;
                        font-size: 16px;
                    }
                    .cinema-info {
                        text-align: right;
                        font-size: 14px;
                    }
                    .details {
                        background: rgba(255,255,255,0.1);
                        border-radius: 8px;
                        padding: 16px;
                        margin-bottom: 16px;
                    }
                    .details-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                    }
                    .seats {
                        font-size: 18px;
                        font-weight: bold;
                    }
                    .price {
                        text-align: right;
                        font-size: 18px;
                        font-weight: bold;
                    }
                    .booking-details {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                        font-size: 12px;
                    }
                    .qr-code {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        width: 60px;
                        height: 60px;
                        background: white;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #333;
                        font-size: 10px;
                        text-align: center;
                    }
                    .footer {
                        margin-top: 20px;
                        padding-top: 16px;
                        border-top: 1px dashed rgba(255,255,255,0.3);
                        text-align: center;
                        font-size: 10px;
                        opacity: 0.8;
                    }
                    .footer p {
                        margin: 0 0 4px 0;
                    }
                    @media print {
                        body { 
                            background: white; 
                            padding: 0; 
                        }
                        .ticket {
                            box-shadow: none;
                            max-width: none;
                            width: 100%;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <div class="header">
                        <h1>HOT CINEMAS</h1>
                        <p>VÉ XEM PHIM ĐIỆN TỬ</p>
                    </div>
                    
                    <div class="content">
                        <div class="movie-info">
                            <h2>${t.movie}</h2>
                            <div>📍 ${t.cinema}</div>
                            <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">
                                ${t.cinemaAddress}
                            </div>
                        </div>
                        <div class="cinema-info">
                            <div>📅 ${o(t.showtime).format("DD/MM/YYYY")}</div>
                            <div>🕐 ${o(t.showtime).format("HH:mm")}</div>
                            <div>🎬 ${t.room}</div>
                        </div>
                    </div>
                    
                    <div class="details">
                        <div class="details-grid">
                            <div>
                                <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">GHẾ NGỒI</div>
                                <div class="seats">${t.seats.join(", ")}</div>
                            </div>
                            <div class="price">
                                <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px; text-align: right;">TỔNG TIỀN</div>
                                <div>${t.totalPrice.toLocaleString("vi-VN")} VNĐ</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="booking-details">
                        <div>
                            <div>Mã vé: <strong>${t.id}</strong></div>
                            <div>Số lượng: ${t.quantity} vé</div>
                        </div>
                        <div style="text-align: right;">
                            <div>Ngày đặt: ${o(t.bookingDate).format("DD/MM/YYYY")}</div>
                            <div>Thanh toán: ${t.paymentMethod}</div>
                        </div>
                    </div>
                    
                    <div class="qr-code">QR</div>
                    
                    <div class="footer">
                        <p>Vui lòng có mặt tại rạp trước 15 phút</p>
                        <p>Hotline: 1900-6017 | Website: hotcinemas.vn</p>
                        <p>In vé lúc: ${o().format("DD/MM/YYYY HH:mm:ss")}</p>
                    </div>
                </div>
            </body>
            </html>
        `;i.document.write(oe),i.document.close(),i.focus(),setTimeout(()=>{i.print()},500)},B=t=>{G.success(`Đang tải vé ${t}...`)},N=t=>{k.confirm({title:"Xác nhận hủy vé",content:"Bạn có chắc chắn muốn hủy vé này không? Hành động này không thể hoàn tác.",onOk:()=>{G.success(`Đã hủy vé ${t}`)}})},te=[{title:"Mã vé",dataIndex:"id",key:"id",width:100,render:t=>e.jsx(h,{strong:!0,children:t})},{title:"Phim",dataIndex:"movie",key:"movie",width:200,render:(t,i)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx(O,{src:i.moviePoster,alt:t,width:40,height:60,preview:!1,style:{borderRadius:"4px"},fallback:"https://via.placeholder.com/40x60?text=No+Image"}),e.jsxs("div",{children:[e.jsx(h,{strong:!0,children:t}),e.jsx("br",{}),e.jsx(h,{type:"secondary",children:i.room})]})]})},{title:"Rạp chiếu",dataIndex:"cinema",key:"cinema",width:180,render:(t,i)=>e.jsxs("div",{children:[e.jsx(h,{strong:!0,children:t}),e.jsx("br",{}),e.jsx(h,{type:"secondary",style:{fontSize:"12px"},children:i.cinemaAddress})]})},{title:"Ghế",dataIndex:"seats",key:"seats",width:100,render:t=>e.jsx(M,{wrap:!0,children:t.map(i=>e.jsx(b,{color:"blue",children:i},i))})},{title:"Suất chiếu",dataIndex:"showtime",key:"showtime",width:140,render:t=>e.jsxs("div",{children:[e.jsxs("div",{children:[e.jsx($,{})," ",o(t).format("DD/MM/YYYY")]}),e.jsxs("div",{children:[e.jsx(L,{})," ",o(t).format("HH:mm")]})]})},{title:"Tổng tiền",dataIndex:"totalPrice",key:"totalPrice",width:120,render:t=>e.jsxs(h,{strong:!0,style:{color:"#e50914"},children:[new Intl.NumberFormat("vi-VN").format(t),"đ"]})},{title:"Trạng thái",dataIndex:"status",key:"status",width:120,render:t=>e.jsx(b,{color:R(t),children:H(t)})},{title:"Thao tác",key:"actions",width:180,render:(t,i)=>e.jsxs(M,{size:"middle",children:[e.jsx(u,{title:"Xem chi tiết",children:e.jsx(r,{type:"link",icon:e.jsx(pe,{}),onClick:()=>ee(i),size:"small"})}),(i.status==="completed"||i.status==="upcoming")&&e.jsx(u,{title:"Xem vé",children:e.jsx(r,{type:"link",icon:e.jsx(z,{}),onClick:()=>P(i),size:"small",style:{color:"#1890ff"}})}),(i.status==="completed"||i.status==="upcoming")&&e.jsx(u,{title:"In vé",children:e.jsx(r,{type:"link",icon:e.jsx(C,{}),onClick:()=>I(i),size:"small",style:{color:"#52c41a"}})}),i.status==="completed"&&e.jsx(u,{title:"Tải vé",children:e.jsx(r,{type:"link",icon:e.jsx(q,{}),onClick:()=>B(i.id),size:"small"})}),i.status==="upcoming"&&e.jsx(u,{title:"Hủy vé",children:e.jsx(r,{type:"link",danger:!0,icon:e.jsx(W,{}),onClick:()=>N(i.id),size:"small"})})]})}],ie=v.length,se=v.filter(t=>t.status==="completed").length,ne=v.filter(t=>t.status==="upcoming").length,re=v.filter(t=>t.status==="completed").reduce((t,i)=>t+i.totalPrice,0);return n?e.jsx("div",{style:{padding:"20px",minHeight:"100vh",background:"#f0f2f5"},children:e.jsxs("div",{style:{maxWidth:"1400px",margin:"0 auto"},children:[e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx(D,{level:2,style:{color:"#1890ff",marginBottom:"8px"},children:"📋 Lịch sử đặt vé"}),e.jsx(X,{style:{color:"#666",fontSize:"16px"},children:"Quản lý và theo dõi tất cả các vé đã đặt của bạn"})]}),e.jsxs(S,{gutter:[16,16],style:{marginBottom:"24px"},children:[e.jsx(c,{xs:24,sm:6,children:e.jsx(p,{children:e.jsx(y,{title:"Tổng số vé",value:ie,valueStyle:{color:"#3f8600"},prefix:e.jsx($,{})})})}),e.jsx(c,{xs:24,sm:6,children:e.jsx(p,{children:e.jsx(y,{title:"Đã hoàn thành",value:se,valueStyle:{color:"#52c41a"},prefix:e.jsx(A,{})})})}),e.jsx(c,{xs:24,sm:6,children:e.jsx(p,{children:e.jsx(y,{title:"Sắp chiếu",value:ne,valueStyle:{color:"#1890ff"},prefix:e.jsx(L,{})})})}),e.jsx(c,{xs:24,sm:6,children:e.jsx(p,{children:e.jsx(y,{title:"Tổng chi tiêu",value:re,formatter:t=>`${new Intl.NumberFormat("vi-VN").format(t)}đ`,valueStyle:{color:"#faad14"},prefix:e.jsx(A,{})})})})]}),e.jsx(p,{style:{marginBottom:"24px"},children:e.jsxs(S,{gutter:[16,16],align:"middle",children:[e.jsx(c,{xs:24,sm:8,children:e.jsx(he,{prefix:e.jsx(xe,{}),placeholder:"Tìm kiếm theo tên phim, rạp, mã vé...",value:l,onChange:t=>g(t.target.value),allowClear:!0,size:"large"})}),e.jsx(c,{xs:24,sm:6,children:e.jsxs(F,{placeholder:"Trạng thái",value:m,onChange:K,allowClear:!0,size:"large",style:{width:"100%"},children:[e.jsx(w,{value:"completed",children:"Đã hoàn thành"}),e.jsx(w,{value:"upcoming",children:"Sắp chiếu"}),e.jsx(w,{value:"cancelled",children:"Đã hủy"}),e.jsx(w,{value:"expired",children:"Đã hết hạn"})]})}),e.jsx(c,{xs:24,sm:10,children:e.jsx(ye,{placeholder:["Từ ngày","Đến ngày"],value:x,onChange:Q,size:"large",style:{width:"100%"},format:"DD/MM/YYYY"})})]})}),e.jsx(p,{children:V.length===0?e.jsx(E,{description:"Không tìm thấy vé nào",image:E.PRESENTED_IMAGE_SIMPLE}):e.jsx(ue,{columns:te,dataSource:V,rowKey:"id",pagination:{showSizeChanger:!0,showQuickJumper:!0,showTotal:(t,i)=>`${i[0]}-${i[1]} của ${t} vé`},scroll:{x:1200}})}),e.jsx(k,{title:"Chi tiết đặt vé",open:_,onCancel:()=>f(!1),footer:[e.jsx(r,{onClick:()=>f(!1),children:"Đóng"},"close"),(s?.status==="completed"||s?.status==="upcoming")&&e.jsx(r,{icon:e.jsx(z,{}),onClick:()=>P(s),style:{background:"#1890ff",borderColor:"#1890ff",color:"white"},children:"Xem vé"},"view"),(s?.status==="completed"||s?.status==="upcoming")&&e.jsx(r,{icon:e.jsx(C,{}),onClick:()=>I(s),style:{background:"#52c41a",borderColor:"#52c41a",color:"white"},children:"In vé"},"print"),s?.status==="completed"&&e.jsx(r,{type:"primary",icon:e.jsx(q,{}),onClick:()=>B(s?.id),children:"Tải vé"},"download"),s?.status==="upcoming"&&e.jsx(r,{danger:!0,icon:e.jsx(W,{}),onClick:()=>{f(!1),N(s?.id)},children:"Hủy vé"},"cancel")].filter(Boolean),width:700,children:s&&e.jsx("div",{children:e.jsxs(S,{gutter:[24,24],children:[e.jsx(c,{span:8,children:e.jsx(O,{src:s.moviePoster,alt:s.movie,width:"100%",style:{borderRadius:"8px"},fallback:"https://via.placeholder.com/200x300?text=No+Image"})}),e.jsxs(c,{span:16,children:[e.jsx(D,{level:4,children:s.movie}),e.jsx(b,{color:R(s.status),children:H(s.status)}),e.jsx(me,{}),e.jsxs(a,{column:1,size:"small",children:[e.jsx(a.Item,{label:"Mã vé",children:e.jsx(h,{strong:!0,children:s.id})}),e.jsx(a.Item,{label:"Rạp chiếu",children:s.cinema}),e.jsx(a.Item,{label:"Địa chỉ",children:s.cinemaAddress}),e.jsx(a.Item,{label:"Phòng chiếu",children:s.room}),e.jsx(a.Item,{label:"Ghế ngồi",children:e.jsx(M,{children:s.seats.map(t=>e.jsx(b,{color:"blue",children:t},t))})}),e.jsx(a.Item,{label:"Suất chiếu",children:o(s.showtime).format("DD/MM/YYYY HH:mm")}),e.jsx(a.Item,{label:"Ngày đặt",children:o(s.bookingDate).format("DD/MM/YYYY HH:mm")}),e.jsx(a.Item,{label:"Phương thức thanh toán",children:s.paymentMethod}),e.jsx(a.Item,{label:"Tổng tiền",children:e.jsxs(h,{strong:!0,style:{color:"#e50914"},children:[new Intl.NumberFormat("vi-VN").format(s.totalPrice),"đ"]})}),s.status==="cancelled"&&s.refundAmount&&e.jsx(a.Item,{label:"Số tiền hoàn",children:e.jsxs(h,{strong:!0,style:{color:"#52c41a"},children:[new Intl.NumberFormat("vi-VN").format(s.refundAmount),"đ"]})}),s.hasReviewed&&e.jsx(a.Item,{label:"Đánh giá của bạn",children:e.jsx(ve,{disabled:!0,defaultValue:s.rating})})]})]})]})})}),e.jsx(k,{title:e.jsxs("span",{children:[e.jsx(z,{})," Xem vé"]}),open:U,onCancel:()=>j(!1),width:600,footer:[e.jsx(r,{onClick:()=>j(!1),children:"Đóng"},"close"),e.jsx(r,{type:"primary",icon:e.jsx(C,{}),onClick:()=>{I(T),j(!1)},children:"In vé"},"print")],children:T&&e.jsx(be,{ticket:T})})]})}):e.jsx("div",{style:{padding:"50px",textAlign:"center"},children:e.jsxs(p,{children:[e.jsx(de,{style:{fontSize:"48px",color:"#e50914",marginBottom:"20px"}}),e.jsx(D,{level:3,children:"Bạn chưa đăng nhập"}),e.jsx(X,{children:"Vui lòng đăng nhập để xem lịch sử đặt vé"}),e.jsx(r,{type:"primary",size:"large",href:"/login-demo",children:"Đăng nhập"})]})})};export{Ee as default};
