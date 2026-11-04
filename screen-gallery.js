const tripkitScreens = [
  ["01 · Welcome.png","Welcome","Getting started"],
  ["02 · Onboarding.png","Onboarding","Getting started"],
  ["03 · Create account.png","Create account","Getting started"],
  ["04 · Property gallery.png","Property gallery","Discover a stay"],
  ["05 · Property details.png","Property details","Discover a stay"],
  ["06 · Reviews.png","Reviews","Discover a stay"],
  ["07 · Explore.png","Explore","Discover a stay"],
  ["08 · Search & filters.png","Search & filters","Plan your search"],
  ["09 · Map search.png","Map search","Plan your search"],
  ["10 · Dates & guests.png","Dates & guests","Plan your search"],
  ["11 · Checkout.png","Checkout","Book your stay"],
  ["12 · Booking confirmed.png","Booking confirmed","Book your stay"],
  ["13 · My trips.png","My trips","Guest tools"],
  ["14 · Trip itinerary.png","Trip itinerary","Guest tools"],
  ["15 · Wishlist.png","Wishlist","Guest tools"],
  ["16 · Host dashboard.png","Host dashboard","Host tools"],
  ["17 · Edit listing.png","Edit listing","Host tools"],
  ["18 · Calendar & availability.png","Calendar & availability","Host tools"],
  ["19 · Reservations.png","Reservations","Host tools"],
  ["20 · Earnings.png","Earnings","Host tools"],
  ["21 · Reviews from guests.png","Guest reviews","Host tools"],
  ["22 · Inbox.png","Inbox","Messages & account"],
  ["23 · Chat.png","Chat","Messages & account"],
  ["24 · Profile & settings.png","Profile & settings","Messages & account"]
].map(([file,title,group],index)=>({file,title,group,index}));

const tripkitDescriptions={
  "Getting started":"A warm introduction to TripKit and the stays waiting to be discovered.",
  "Discover a stay":"Explore unique places, property details, and thoughtful guest reviews.",
  "Plan your search":"Narrow down a stay with flexible dates, guests, filters, and a map.",
  "Book your stay":"Review trip details and move through a clear booking flow.",
  "Guest tools":"Keep reservations, itineraries, and saved stays together.",
  "Host tools":"Manage listings, availability, bookings, earnings, and guest feedback.",
  "Messages & account":"Stay in touch and keep your profile and preferences up to date."
};

const tripkitScreenList=document.querySelector("#tripkitScreenList");
const tripkitGalleryGrid=document.querySelector("#tripkitGalleryGrid");
const tripkitSearch=document.querySelector("#tripkitScreenSearch");
const tripkitPreview=document.querySelector("#tripkitScreenImage");
const tripkitDialog=document.querySelector("#tripkitScreenDialog");
let selectedTripkitScreen=6;

function selectTripkitScreen(index,scroll=false){
  selectedTripkitScreen=(index+tripkitScreens.length)%tripkitScreens.length;
  const screen=tripkitScreens[selectedTripkitScreen];
  const src=`./public/assets/${encodeURIComponent(screen.file)}`;
  tripkitPreview.src=src;
  tripkitPreview.alt=`TripKit ${screen.title} screen`;
  document.querySelector("#tripkitScreenGroup").textContent=screen.group.toUpperCase();
  document.querySelector("#tripkitScreenFlow").textContent=screen.group.toUpperCase();
  document.querySelector("#tripkitScreenTitle").textContent=screen.title;
  document.querySelector("#tripkitScreenSummary").textContent=tripkitDescriptions[screen.group];
  document.querySelector("#tripkitScreenCount").textContent=`${String(selectedTripkitScreen+1).padStart(2,"0")} / ${tripkitScreens.length}`;
  document.querySelector("#tripkitScreenNumber").textContent=String(selectedTripkitScreen+1).padStart(2,"0");
  document.querySelectorAll(".screen-option").forEach(button=>{
    const active=Number(button.dataset.index)===selectedTripkitScreen;
    button.classList.toggle("active",active);
    if(active)button.setAttribute("aria-current","step");else button.removeAttribute("aria-current");
  });
  document.querySelectorAll(".tripkit-gallery-card").forEach(button=>button.classList.toggle("active",Number(button.dataset.index)===selectedTripkitScreen));
  if(scroll)document.querySelector("#screens").scrollIntoView({behavior:"smooth",block:"start"});
}

function buildTripkitList(query=""){
  tripkitScreenList.replaceChildren();
  const search=query.trim().toLowerCase();
  let lastGroup="";
  tripkitScreens.forEach((screen,index)=>{
    if(search&&!`${screen.title} ${screen.group}`.toLowerCase().includes(search))return;
    if(screen.group!==lastGroup){
      const heading=document.createElement("span");
      heading.className="screen-group";
      heading.textContent=screen.group.toUpperCase();
      tripkitScreenList.append(heading);
      lastGroup=screen.group;
    }
    const button=document.createElement("button");
    button.type="button";
    button.className="screen-option";
    button.dataset.index=index;
    button.innerHTML=`<span class="screen-number">${String(index+1).padStart(2,"0")}</span><span>${screen.title}</span>`;
    button.addEventListener("click",()=>selectTripkitScreen(index));
    tripkitScreenList.append(button);
  });
  if(search&&!tripkitScreenList.children.length){const empty=document.createElement("p");empty.className="screen-empty";empty.textContent="No matching screens";tripkitScreenList.append(empty);}
  selectTripkitScreen(selectedTripkitScreen);
}

function buildTripkitGallery(){
  tripkitGalleryGrid.replaceChildren();
  tripkitScreens.forEach((screen,index)=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="tripkit-gallery-card";
    button.dataset.index=index;
    button.setAttribute("aria-label",`Preview ${screen.title}`);
    button.innerHTML=`<span class="tripkit-gallery-thumb"><img src="./public/assets/${encodeURIComponent(screen.file)}" alt="" loading="lazy"></span><strong>${screen.title}</strong><small>${screen.group}</small>`;
    button.addEventListener("click",()=>selectTripkitScreen(index,true));
    tripkitGalleryGrid.append(button);
  });
}

tripkitSearch.addEventListener("input",event=>buildTripkitList(event.target.value));
document.querySelector("#tripkitPrev").addEventListener("click",()=>selectTripkitScreen(selectedTripkitScreen-1));
document.querySelector("#tripkitNext").addEventListener("click",()=>selectTripkitScreen(selectedTripkitScreen+1));
document.addEventListener("keydown",event=>{
  if(event.target.matches("input,textarea")||tripkitDialog.open)return;
  if(event.key==="ArrowLeft")selectTripkitScreen(selectedTripkitScreen-1);
  if(event.key==="ArrowRight")selectTripkitScreen(selectedTripkitScreen+1);
});
document.querySelector("#tripkitExpand").addEventListener("click",()=>{
  document.querySelector("#tripkitDialogImage").src=tripkitPreview.src;
  document.querySelector("#tripkitDialogImage").alt=tripkitPreview.alt;
  tripkitDialog.showModal();
});
document.querySelector("#tripkitCloseDialog").addEventListener("click",()=>tripkitDialog.close());
tripkitDialog.addEventListener("click",event=>{if(event.target===tripkitDialog)tripkitDialog.close();});

buildTripkitGallery();
buildTripkitList();
