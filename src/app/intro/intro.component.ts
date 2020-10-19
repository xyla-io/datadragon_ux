import {Component, OnInit} from '@angular/core';
import {YoutubePlayerModule} from 'ngx-youtube-player';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})

export class IntroComponent implements OnInit {
  player: YT.Player;
  public id: string = 'INTROVIDEOID';

  times = [
    {name: "Add Account", timestart: "19", timeend: '58'},
    {name: "Simple Rules", timestart: "58", timeend: '418'},
    {name: "Cruise Control Rules", timestart: "419"}
  ]


  constructor(){
  }

  savePlayer (player) {
    this.player = player;
  }
  onStateChange(event){

  }

  playVideo(timestart, timeend) {
    this.player.cueVideoById({'videoId': this.id,'startSeconds': timestart,'endSeconds': timeend, 'suggestedQuality': "hd1080"})
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

  ngOnInit() {

  }

}
