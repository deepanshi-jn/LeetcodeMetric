document.addEventListener("DOMContentLoaded",function(){


    const searchButton=document.getElementById("search-btn");
    const usernameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircl=document.querySelector(".easy-progress");
    const mediumProgressCircl=document.querySelector(".medium-progress");
    const hardProgressCircl=document.querySelector(".hard-progress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer=document.querySelector(".stats-card");


    function validateUsername(username){
        if(username.trim()===""){
            alert("Username should not be empty")
            return false;
        }
        const regex=/^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching =regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username){
        const url=`https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchButton.textContent="Searching...";
            searchButton.disabled=true;

            const response=await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the User details");
            }
            const data=await response.json();
            console.log("Logging data: ",data);
            displayUserData(data);
        }
        catch(error){
            statsContainer.innerHTML=`${error.message}`;
        }finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }

    function updateProgress(solved,total,label,circle){
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;
        statsContainer.style.display = "block";
    }

    function displayUserData(data){
        const totalQues= data.totalQuestions;
        const totalHardQues= data.totalHard;
        const totalEasyQues= data.totalEasy;
        const totalMediumQues= data.totalMedium;

        const solvedTotalQues=data.totalSolved;
        const solvedTotalEasyQues=data.easySolved;
        const solvedTotalMediumQues=data.mediumSolved;
        const solvedTotalHarsQues=data.hardSolved;

        updateProgress(solvedTotalEasyQues,totalEasyQues,easyLabel,easyProgressCircl);
        updateProgress(solvedTotalMediumQues,totalMediumQues,mediumLabel,mediumProgressCircl);
        updateProgress(solvedTotalHarsQues,totalHardQues,hardLabel,hardProgressCircl);

        const cardsData=[
            {label:"Accepatance Rate : ", value:data.acceptanceRate},
            {label:"Ranking : ", value:data.ranking},
        ];

        console.log("cards ka data" , cardsData);

        cardStatsContainer.innerHTML = cardsData
        .map(data => {
            return `
                <div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                </div>
            `;
        })
        .join("");
    }

    searchButton.addEventListener('click',function(){
        const username = usernameInput.value;
        console.log("Logging username: " , username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
        
    })
})