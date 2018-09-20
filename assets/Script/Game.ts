// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {JoyStick} from "./JoyStick";

const {ccclass, property} = cc._decorator;

@ccclass
export class Game extends cc.Component {

    @property
    text: string = 'hello';
    @property(cc.Vec2)
    speed: cc.Vec2 = null;



    @property(cc.RigidBody)
    buddy: cc.RigidBody = null;

    @property(JoyStick)
    stick: JoyStick = null;

    private key: any = null;

    onLoad(){
        window.g = this;

        window.plot = function(p1,p2){
            return Math.sqrt( cc.math.square(p1.x-p2.x) + cc.math.square(p1.y -p2.y));
        }


        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;

        physicsManager.debugDrawFlags =
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit
        ;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event){
        cc.log('onKeyDown:',event.keyCode);
        if (event.keyCode === 37 || event.keyCode === 39){
            this.key = event.keyCode;

        }

        if (event.keyCode === 38){
            this.buddy.linearVelocity = cc.v2(0,1000)
        }

        if (event.keyCode === 40){
            this.buddy.linearVelocity = cc.v2(0,-1000)
        }
    }

    onKeyUp(event){
        cc.log('onKeyUp:',event.keyCode);

        if (event.keyCode === this.key){
            this.key = null;
        }
    }

     update (dt) {
        let normal = this.stick.getNormal()
        this.buddy.linearVelocity = cc.v2(this.speed.x*normal.x,this.speed.yss*normal.y);
        // if (this.key){
        //     //left
        //     if (this.key === 37){
        //         this.buddy.node.setPositionX(this.buddy.node.getPositionX()-5);
        //     }
        //     //right
        //     if (this.key === 39){
        //         this.buddy.node.setPositionX(this.buddy.node.getPositionX()+5);
        //
        //     }
        //
        // }
     }
}
