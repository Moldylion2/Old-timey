(function() {
  var game;
  var ui;

  var DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric' };

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    // Add your custom code here.
  };

  var TITLE = "Social Democracy: An Alternate History" + '_' + "Autumn Chen";

  // the url is a link to game.json
  // test url: https://aucchen.github.io/social_democracy_mods/v0.1.json
  // TODO; 
  window.loadMod = function(url) {
      ui.loadGame(url);
  };

  window.showStats = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('library')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('library');
    }
  };

  window.showMods = function() {
    window.hideOptions();
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('mod_loader')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('mod_loader');
    }
  };
  
  window.showOptions = function() {
      var save_element = document.getElementById('options');
      window.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  window.hideOptions();
              }
          };
      }
  };

  window.hideOptions = function() {
      var save_element = document.getElementById('options');
      save_element.style.display = "none";
  };

  window.disableBg = function() {
      window.dendryUI.disable_bg = true;
      document.body.style.backgroundImage = 'none';
      window.dendryUI.saveSettings();
  };

  window.enableBg = function() {
      window.dendryUI.disable_bg = false;
      window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
      window.dendryUI.saveSettings();
  };

  window.disableAnimate = function() {
      window.dendryUI.animate = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimate = function() {
      window.dendryUI.animate = true;
      window.dendryUI.saveSettings();
  };

  window.disableAnimateBg = function() {
      window.dendryUI.animate_bg = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimateBg = function() {
      window.dendryUI.animate_bg = true;
      window.dendryUI.saveSettings();
  };

  window.disableAudio = function() {
      window.dendryUI.toggle_audio(false);
      window.dendryUI.saveSettings();
  };

  window.enableAudio = function() {
      window.dendryUI.toggle_audio(true);
      window.dendryUI.saveSettings();
  };

  window.enableImages = function() {
      window.dendryUI.show_portraits = true;
      window.dendryUI.saveSettings();
  };

  window.disableImages = function() {
      window.dendryUI.show_portraits = false;
      window.dendryUI.saveSettings();
  };

  window.enableLightMode = function() {
      window.dendryUI.dark_mode = false;
      document.body.classList.remove('dark-mode');
      window.dendryUI.saveSettings();
  };
  window.enableDarkMode = function() {
      window.dendryUI.dark_mode = true;
      document.body.classList.add('dark-mode');
      window.dendryUI.saveSettings();
  };

  // populates the checkboxes in the options view
  window.populateOptions = function() {
    var disable_bg = window.dendryUI.disable_bg;
    var animate = window.dendryUI.animate;
    var disable_audio = window.dendryUI.disable_audio;
    var show_portraits = window.dendryUI.show_portraits;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (disable_audio) {
        $('#audio_no')[0].checked = true;
    } else {
        $('#audio_yes')[0].checked = true;
    }
    if (show_portraits) {
        $('#images_yes')[0].checked = true;
    } else {
        $('#images_no')[0].checked = true;
    }
    if (window.dendryUI.dark_mode) {
        $('#dark_mode')[0].checked = true;
    } else {
        $('#light_mode')[0].checked = true;
    }
  };

  
  // This function allows you to modify the text before it's displayed.
  // E.g. wrapping chat-like messages in spans.
  window.displayText = function(text) {
      return text;
  };

  // This function allows you to do something in response to signals.
  window.handleSignal = function(signal, event, scene_id) {
  };
  
  // This function runs on a new page. Right now, this auto-saves.
  window.onNewPage = function() {
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root' && !window.justLoaded) {
        window.dendryUI.autosave();
    }
    if (window.justLoaded) {
        window.justLoaded = false;
    }
  };

  // TODO: have some code for tabbed sidebar browsing.
  window.updateSidebar = function() {
      $('#qualities').empty();
      var scene = dendryUI.game.scenes[window.statusTab];
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#qualities').append(dendryUI.contentToHTML.convert(displayContent));
  };

  window.changeTab = function(newTab, tabId) {
      if (tabId == 'poll_tab' && dendryUI.dendryEngine.state.qualities.historical_mode) {
          window.alert('Polls are not available in historical mode.');
          return;
      }
      var tabButton = document.getElementById(tabId);
      var tabButtons = document.getElementsByClassName('tab_button');
      for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
      }
      tabButton.className += ' active';
      window.statusTab = newTab;
      window.updateSidebar();
  };

  window.onDisplayContent = function() {
      window.updateSidebar();
  };

  /*
   * This function copied from the code for Infinite Space Battle Simulator
   *
   * quality - a number between max and min
   * qualityName - the name of the quality
   * max and min - numbers
   * colors - if true/1, will use some color scheme - green to yellow to red for high to low
   * */
  window.generateBar = function(quality, qualityName, max, min, colors) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      var value = document.createElement('div');
      value.className = 'barValue';
      var width = (quality - min)/(max - min);
      if (width > 1) {
          width = 1;
      } else if (width < 0) {
          width = 0;
      }
      value.style.width = Math.round(width*100) + '%';
      if (colors) {
          value.style.backgroundColor = window.probToColor(width*100);
      }
      bar.textContent = qualityName + ': ' + quality;
      if (colors) {
          bar.textContent += '/' + max;
      }
      bar.appendChild(value);
      return bar;
  };


  window.justLoaded = true;
  window.statusTab = "status";
  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.onload = function() {
    window.dendryUI.loadSettings({show_portraits: false});
    if (window.dendryUI.dark_mode) {
        document.body.classList.add('dark-mode');
    }
    window.pinnedCardsDescription = "Advisor cards - actions are only usable once per 6 months.";
  };

  window.westminster = function(container_id, forming_government) {
    // container_id has to be an svg for this to work
    

    // Here is my html setup in status.scene.dry to display an svg graphic 
    /* 
        <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
        <svg id='westminster_legislature' viewBox="-80 0 400 150" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" ></svg>
        </div> 
    */


    var Q = window.dendryUI?.dendryEngine?.state?.qualities;

    Q.brit_mode = false; // Handles whether speaker is non-affiliated (uk) or a party member (canada) and whether circles (uk) or squares (canada)
    Q.sask_mode = true; // This will create paired seats like in most Canadian Assemblies graphics
    var house_width = 3; 
    var container = document.getElementById(container_id);

    // Make sure to remove units such as 'em' or 'px' if using brit_mode which uses circle element -> unit-less numbers for radius

    container.innerHTML = ''; //Remove any previous html inside the container first

    var data = Q.parliament_diagram; // This may not be applicable to base game
    // If you are seeking to use this function yourself, find all instances of the 'var data' variable (1 in root, 1 in 1928_election scene, and possibly 1 in post_event) and then make Q.parliament_diagram equal to it. 
    
    var parties_list = Q.parties || ['labour', 'tories', 'liberals', 'cpgb', 'other']; // Replace as you wish

    var governing_parties_list = [];
    var governing_seats = 0; 
    var opposition_parties_list = []; 
    var opposition_seats = 0; 

    var party_seats = 0;
    var speaker_party = null;

    // Lets get seats and id for government parties and hand speaker to the largest
    for (var party of parties_list) {
        if (Q[party + '_in_government']) {
            var old_party_seats = party_seats;
            party_seats = Q[party + '_seats']; 
            governing_parties_list.push([party, party_seats]);

            governing_seats += party_seats; 

            if (old_party_seats < party_seats) {
                speaker_party = party;
            };
        }
    };

    // This removes one seat from the SOTH party
    var gov_spk_entry = governing_parties_list.find(p => p[0] == speaker_party);
    if (gov_spk_entry) gov_spk_entry[1] -= 1;

    // Now let's get seats and id for opposition parties
    for (var party of parties_list) {
        if (!Q[party + '_in_government']) {
            party_seats = Q[party + '_seats']; 
            opposition_parties_list.push([party, party_seats]);

            opposition_seats += party_seats;
        }
    };

    // First option: british mode second: Canada
    // This uses ternary operator syntax, google it for more info but basic is this -> condition ? true : false -> returning the contents on either side of colon depending on truthyness or falsyness
    var soth = Q.brit_mode ? `<circle id="soth" cx="-60" cy="65" r="6"></circle>` : `<rect id="soth" class="seat ${speaker_party}" x="-60" y="65" height="12px" width="12px" stroke="black" stroke-width="1" />`; // This is the speaker of the house circle and it's cords

    Q.parliament_html = soth;

    // If you'd like only the largest party to be on the government benches at first, ensure only that party has Q expression Q[(party_id) + '_in_government'] set to 1 (or true ig)

        var x = -30; 
        var opp_y_base = 60;
        var y = opp_y_base; 
        var seats_in_row = 0;
        var opp_count = 1;
        var opp_col_index = 0;

        // Lets assemble this display now

        for (var party of opposition_parties_list) {
            var party_id = party[0];
            var seats_to_add = party[1]; 
            
            for (var s = 0; s < seats_to_add; s++) {

                // This is for new row
                if (seats_in_row >= house_width) {
                    opp_col_index++;
                    x += 15; 
                    y = opp_y_base; 
                    seats_in_row = 0;
                    
                    // Extra gap after every second column
                    if (Q.sask_mode && opp_col_index % 2 === 0) {
                        x += 5; 
                    }
                }
                
                y -= 15; 
                seats_in_row += 1;

                var id = 'O' + opp_count;
                addSeat(id, party_id, x, y, container, forming_government);
                opp_count += 1;
            }
        }

        // Let's load base settings for government side
        var x = -30; 
        var gov_y_base = 75; 
        y = gov_y_base; 
        var seats_in_row = 0;
        var gov_count = 1;
        var gov_col_index = 0;

        for (var party of governing_parties_list) {
            var party_id = party[0];
            var seats_to_add = party[1]; 
            
            for (var s = 0; s < seats_to_add; s++) {
                if (seats_in_row >= house_width) {
                    gov_col_index++;
                    x += 15; 
                    y = gov_y_base; // Reset to base Y
                    seats_in_row = 0;
                    
                    // Extra gap after every second column
                    if (Q.sask_mode && gov_col_index % 2 === 0) {
                        x += 5; 
                    }
                }

                y += 15; 
                seats_in_row += 1;

                var id = 'G' + gov_count;
                addSeat(id, party_id, x, y, container, forming_government);
                gov_count += 1;
            }
        }

    // Now let's apply all of that to the container
    container.innerHTML += Q.parliament_html;

    // Animation below credited to ChatGPT
    if (forming_government) {

        var seats = container.querySelectorAll('.seat');

        seats.forEach(function(seat) {
            seat.style.transition = 'none';
        });

        // Force the browser to render the starting positions
        void container.getBoundingClientRect();

        requestAnimationFrame(function() {

            seats.forEach(function(seat, index) {

                seat.style.transition =
                    'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';

                seat.style.transitionDelay =
                    (index * 0.015) + 's';

                seat.setAttribute(
                    'transform',
                    'translate(0 0)'
                );
            });

        });
}
};

function addSeat(id, party_id, x, y, container, forming_government) {

    var Q = window.dendryUI?.dendryEngine?.state?.qualities;

    var dx;
    var dy;

    var viewBox = container.viewBox.baseVal;

    var centerX = viewBox.width
        ? viewBox.x + viewBox.width / 2
        : 0;

    var centerY = viewBox.height
        ? viewBox.y + viewBox.height / 2
        : 0;

    if (Q.brit_mode) {
        // Circle's center is cx/cy
        dx = centerX - x;
        dy = centerY - y;

        Q.parliament_html +=
            `<circle id="${id}" class="seat ${party_id}"
                cx="${x}" cy="${y}" r="6"
                ${forming_government ? `transform="translate(${dx} ${dy})"` : ''}>
            </circle>`;
    } else {
        // Rect's center is x+6 / y+6
        dx = centerX - (x + 6);
        dy = centerY - (y + 6);

        Q.parliament_html +=
            `<rect id="${id}" class="seat ${party_id}"
                x="${x}" y="${y}"
                height="12px" width="12px"
                stroke="black" stroke-width="1"
                ${forming_government ? `transform="translate(${dx} ${dy})"` : ''} />`;
    }
}

}());
