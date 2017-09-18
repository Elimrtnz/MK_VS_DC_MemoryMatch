//====================
//  Global Variables
//====================
var first_card_clicked = null; //variable to hold first front image being compared 
var second_card_clicked = null; // variable to hold second card image being compared
var clickable = true;
var playerTurn = 1;
var matchCombo = 0;
var playerOneWinCount=0;
var playerTwoWinCount=0;

//====================
//  Document Ready
//====================
$(document).ready(function(){
    randomize('.One', characterArray1);
    randomize('.Two', characterArray2);
    startGame();
});

//===============
//  Functions
//===============
function startGame(){
    $('.themeMusic').prop("volume", .20);
	$("div.back").on('click',cardClicked);
    $("#playerOne-stats .playerName").css('color','yellow');
    clickable=false;
    showTurnDiv();
    setTimeout(hideTurnDiv,2800);
    setTimeout(no_click,3000);
}

function cardClicked(){
	if(clickable) {
		var thisCard = $(this);
		$(thisCard).addClass('hideBack');
		if (first_card_clicked === null) {
        	first_card_clicked = thisCard;
            //console.('first_card_clicked : ',first_card_clicked);
    	}
    	else {
            second_card_clicked = thisCard;
            //console.('second_card_clicked : ',second_card_clicked);
        	clickable = false;
        	compareTwoCards(first_card_clicked,second_card_clicked);
    	}

	} //clickable boolean ends
}

function compareTwoCards(cardOne,cardTwo){
	var firstFrontImage = $(cardOne).siblings('.front').css("background-image");
	var secondFrontImage = $(cardTwo).siblings('.front').css("background-image");
    var thisCardsClass = $(cardTwo).siblings('.front');

	if (firstFrontImage === secondFrontImage) {
            //console.("the images match");
            setTimeout(no_click,1300);
            first_card_clicked = null;
            second_card_clicked = null;
            increaseMatchCount();
            dealDamage();
            //check if card matched is the brutality img
            addHealth(thisCardsClass);
            //check if card has sound effect
            soundFX(thisCardsClass);
            //check if any players health is below 0
            setTimeout(checkWin,1305);
        }
        else{
        	//console.("the images DO_NOT match");
        	setTimeout(flipBack, 1700);
            setTimeout(switchTurn,3000);
            setTimeout(no_click,5500);
        }
}

function flipBack(){
    $(first_card_clicked).removeClass('hideBack');
    $(second_card_clicked).removeClass('hideBack');
    first_card_clicked=null;
    second_card_clicked=null;
}

function no_click(){
    clickable = true;
}

function switchTurn(){
	if(playerTurn===1){
		playerTurn = 2;
        //adding highlights around player two
        $("#playerTwo-stats .playerName").css('color','yellow');
        //removing highlights around player one
        $("#playerOne-stats .playerName").css('color','white');
	}
	else if(playerTurn===2){
		playerTurn = 1;
        //adding highlights around player one
        $("#playerOne-stats .playerName").css('color','yellow');
        //removing highlights around player two
        $("#playerTwo-stats .playerName").css('color','white');
	}

    showTurnDiv();
    switchPlayerBoard();
    setTimeout(hideTurnDiv,2500);
    matchCombo = 0;
    //reset attack multiplier display
    $('.attackPower p').text("15 X\'s " + 1);
}

function increaseMatchCount(){
    var match_count=0;
    if(playerTurn===1){
        match_count = $('#playerOne-matches').text();
        match_count++;
        $('#playerOne-matches').text(match_count);
        matchCombo++; 
    }
    else if(playerTurn===2){
        match_count = $('#playerTwo-matches').text();
        match_count++;
        $('#playerTwo-matches').text(match_count);
        matchCombo++;
    }

    if(matchCombo===1){
        $('.attackPower p').text("15 X\'s " + 2);
    }
    else{
        $('.attackPower p').text("15 X\'s " + (matchCombo+1));
    }
}

function dealDamage(){
    var damaged_health;
    var normalDamage = 15;
    if(playerTurn===1){
        if(matchCombo > 1 ){
            //('combo is activated !!!');
            damaged_health = grabHealthOfOppositePlayer()-(normalDamage*matchCombo);
        }
        else{
            damaged_health = grabHealthOfOppositePlayer() - normalDamage;
        }
        $('#playerTwo-health-bar').css('width',''+damaged_health+'%');
        $('#playerTwo-health-bar').attr('aria-valuenow',damaged_health);
        $('#playerTwo-health-bar span').text(damaged_health + "%");
    }
    else if(playerTurn===2){
        if(matchCombo > 1 ){
            damaged_health = grabHealthOfOppositePlayer()-(normalDamage*matchCombo);
        }
        else{
            damaged_health = grabHealthOfOppositePlayer() - normalDamage;
        }
        $('#playerOne-health-bar').css('width',''+damaged_health+'%');
        $('#playerOne-health-bar').attr('aria-valuenow',damaged_health);
        $('#playerOne-health-bar span').text(damaged_health + "%");
    }
}

function addHealth(imgOne){
    var revived_health;
    var add_life = 15;
    if($(imgOne).hasClass('brutality')){
        $('.brutalitySFX').prop('volume',0.4).trigger('play');
            if(playerTurn===1){
                revived_health = grabHealthOfCurentPlayer() + add_life;
                $('#playerOne-health-bar').css('width',''+revived_health+'%');
                $('#playerOne-health-bar').attr('aria-valuenow',revived_health);
                $('#playerOne-health-bar span').text(revived_health + "%");
            }
            else if(playerTurn===2){
                revived_health = grabHealthOfCurentPlayer() + add_life;
                $('#playerTwo-health-bar').css('width',''+revived_health+'%');
                $('#playerTwo-health-bar').attr('aria-valuenow',revived_health);
                $('#playerTwo-health-bar span').text(revived_health + "%");
            }
    }
}

function grabHealthOfCurentPlayer(){
    var currentPlayersHealth=null;
    if(playerTurn===1){
        currentPlayersHealth = parseFloat($('#playerOne-health-bar').attr('aria-valuenow'));
    }
    else if(playerTurn===2){
        currentPlayersHealth = parseFloat($('#playerTwo-health-bar').attr('aria-valuenow'));
    }
    return currentPlayersHealth;
}

function grabHealthOfOppositePlayer(){
    var oppositePlayersHealth=null;
    if(playerTurn===1){
        oppositePlayersHealth= parseFloat($('#playerTwo-health-bar').attr('aria-valuenow'));
    }
    else if(playerTurn===2){
        oppositePlayersHealth= parseFloat($('#playerOne-health-bar').attr('aria-valuenow'));
    }
    return oppositePlayersHealth;
}

function showTurnDiv(){
    if(playerTurn===1){
        $('#switchTurn h1').text('PLAYER ONE FIGHT!!!');
    }
    else if(playerTurn===2){
        $('#switchTurn h1').text('PLAYER TWO FIGHT!!!');
    }
    $('#switchTurn').fadeIn("slow");
}

function hideTurnDiv(){
    $('.fightSFX').prop('volume',0.5).trigger('play');
    $('#switchTurn').css('display','none');
}

function switchPlayerBoard(){
    if(playerTurn===1){
        $("#playerOneBoard").css('display','block');
        $("#playerTwoBoard").css('display','none');
        //console.("#playerOneBoard is on");   
    }
    else if(playerTurn===2){
        $("#playerOneBoard").css('display','none');
        $("#playerTwoBoard").css('display','block');
        //console.("#playerTwoBoard is on");
    }
}

function checkWin(){
    console.log('check win is being called!');
    if($('#playerOne-health-bar').attr('aria-valuenow')<0){
        $('#winDiv h1').text('player two wins!');
        $('#winDiv').css('display','block');
        //clickable shoulde be false
        clickable=false;
        playerTwoWinCount++;
        $('#playerTwo-stats .wins .value').text(playerTwoWinCount);
    }
    else if($('#playerTwo-health-bar').attr('aria-valuenow')<0){
        $('#winDiv h1').text('player One wins!');
        $('#winDiv').css('display','block');
        //clickable shoulde be false
        clickable=false;
        playerOneWinCount++;
        $('#playerOne-stats .wins .value').text(playerOneWinCount);
    }
}

//  Randomize Cards Function  //
var characterArray1 = ['scorpion','subZero','sonya','raiden','baraka','liuKang','shangTsung','fatality','brutality',
                        'scorpion','subZero','sonya','raiden','baraka','liuKang','shangTsung','fatality','brutality'];
var characterArray2 = ['joker','batMan','catWoman','flash','superMan','deathStroke','wonderWoman','fatality','brutality',
                        'joker','batMan','catWoman','flash','superMan','deathStroke','wonderWoman','fatality','brutality'];

function randomize(cardClass,array){
    var PlayerSpecificClass = cardClass;
    var copy_character_array = array.slice();
    var random_number;

    $(PlayerSpecificClass).each(function(){
        $(this).removeClass('scorpion subZero sonya raiden baraka liuKang shangTsung fatality brutality joker batMan catWoman flash superMan deathStroke wonderWoman');
        random_number = Math.floor(Math.random()*copy_character_array.length);
         $(this).addClass(copy_character_array[random_number]);
         copy_character_array.splice(random_number,1);
    })
}

//  Music  //
function music_off(){
    $('.glyphicon-volume-off').css('display','block');
    $('.glyphicon-volume-up').css('display','none');
    $('.audio p').text('Music Off');
    $('.themeMusic').trigger('pause');
}

function music_on(){
    $('.glyphicon-volume-off').css('display','none');
    $('.glyphicon-volume-up').css('display','block');
    $('.audio p').text('Music On');
    $('.themeMusic').trigger('play');
}

//  Sound FX  //
function soundFX(anyCard){
    if($(anyCard).hasClass('fatality')){
        $('.fatalitySFX').prop('volume',0.1).trigger('play');
    }
    else if($(anyCard).hasClass('scorpion')){
        $('.scorpionSFX').prop('volume',0.3).trigger('play');
    }else if($(anyCard).hasClass('batMan')){
        $('.batmanSFX').prop('volume',0.5).trigger('play');
    }
}

//  Reset Function  //
function resetGame(){
    //reload page
    location.reload(true);
}

//  Rematch Function  //
function rematch(){
    //flip all cards back over
    $("div.back").removeClass('hideBack');
    //randomize cards
    randomize('.One', characterArray1);
    randomize('.Two', characterArray2);

    //reset all global variables
    matchCombo = 0;
    playerTurn = 1
    clickable = true;

    //reset player stats and health
    $('.attackPower p').text("15 X\'s " + 1);
    //reset playerOne stats and health
    $('#playerOne-health-bar').css('width',''+100+'%');
    $('#playerOne-health-bar').attr('aria-valuenow',100);
    $('#playerOne-health-bar span').text(100 + "%");
    $('#playerOne-matches').text(0);
    //reset playerTwo stats and health
    $('#playerTwo-health-bar').css('width',''+100+'%');
    $('#playerTwo-health-bar').attr('aria-valuenow',100);
    $('#playerTwo-health-bar span').text(100+ "%");
    $('#playerTwo-matches').text(0);

    //hide win div
    $('#winDiv').css('display','none');

    //reset player one game board display
    switchPlayerBoard();

    //reset player one highlight (yellow)
    $("#playerTwo-stats .playerName").css('color','white');
    $("#playerOne-stats .playerName").css('color','yellow');
}
