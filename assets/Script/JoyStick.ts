// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;


enum TEST {
    ROMA,
    GYRA
}

@ccclass
export class JoyStick extends cc.Component {

    @property(cc.Node)
    joystick: cc.Node = null;

    @property(cc.PhysicsCircleCollider)
    circleCollider: cc.PhysicsCircleCollider = null;

    @property({type: TEST, default: TEST.ROMA}) tokenPrefab = null;


    @property
    raidus: number = 0.0;

    // LIFE-CYCLE CALLBACKS:

    private pressedKeys: any = [];

    private moveJoystick: boolean = false;

    private normal: cc.Vec2 = cc.v2(0, 0);

    onLoad() {
        cc.log('JoyStick Created');
        window.j = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event) {
        let {keyCode} = event;
        if (keyCode === 65){
            this.normal = this.normal.add(cc.v2(-1,0));
        }
        if (keyCode === 68){
            this.normal = this.normal.add(cc.v2(1,0));
        }
        if (keyCode === 87){
            this.normal = this.normal.add(cc.v2(0,1));
        }
        if (keyCode === 83){
            this.normal = this.normal.add(cc.v2(0,-1));

        }
        this.normal.normalizeSelf();

        if (this.pressedKeys.indexOf(keyCode) === -1) this.pressedKeys.push(keyCode);
    }

    onKeyUp(event) {
        let {keyCode} = event;
        if (keyCode === 65){
            // this.normal.x = 0;
            // experimental
            this.normal.x = this.pressedKeys.indexOf(68) === -1 ? 0 : 1
        }
        if (keyCode === 68){
            // this.normal.x = 0;
            this.normal.x = this.pressedKeys.indexOf(65) === -1 ? 0 : -1

        }
        if (keyCode === 87){
            this.normal.y = 0;

        }
        if (keyCode === 83){
            this.normal.y = 0;
        }
        this.pressedKeys = this.pressedKeys.filter((k)=> k !== keyCode);

    }

    start() {

        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            console.log('MOUSE_DOWN');
            this.onJoystickStartTouch(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log('MOUSE_DOWN');
            this.onJoystickStartTouch(event);
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
            console.log('MOUSE_UP');
            this.onJoystickEndTouch(event);

        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log('MOUSE_UP');
            this.onJoystickEndTouch(event);

        }, this);
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log('TOUCH_START');
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            this.onJoystickMoveTouch(event);
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, function (event) {
            debugger;
            this.onJoystickEndTouch(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.onJoystickEndTouch(event);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.onJoystickMoveTouch(event);
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_ENTER, function (event) {
            // console.log('Mouse down');
        }, this);
    }

    onJoystickStartTouch(e) {
        // let t = e.getLocation()
        // let l = this.ClampMagnitude(cc.v2(t.x, t.y), this.Range)
        // this.SpJoystick.node.setPosition(l.x, l.y)
        let loc = e.getLocation();
        if (window.plot(cc.v2(200, 200), e.getLocation)) {
            cc.log(window.plot(cc.v2(200, 200), e.getLocation));
        }
        this.moveJoystick = true;

    }

    onJoystickMoveTouch(event) {
        if (this.moveJoystick) {
            cc.log('moving Joystick')
            let touchPoint = cc.v2(event.getLocation());
            let centerPoint = cc.v2(200, 200);

            const {currentTarget} = event;
            let pos = currentTarget.getPosition();
            this.node.setPosition(pos);
            cc.log(window.plot(cc.v2(200, 200), event.getLocation()));

            let distanceToCenter = window.plot(cc.v2(200, 200), event.getLocation());
            if (this.moveJoystick && distanceToCenter < this.raidus) {
                this.joystick.setPosition(event.getLocation())
            } else {

                let results = cc.director.getPhysicsManager().rayCast(touchPoint, centerPoint, cc.RayCastType.All);
                results.forEach((res, i) => {
                    //     cc.log(res.collider.node._name)
                    if (res.collider.node._name === 'Circle') {
                        this.joystick.setPosition(res.point);
                    }
                })
                // cc.log(results);


            }

            this.normal = touchPoint.sub(centerPoint).normalize();


        }

    }

    onJoystickEndTouch(e) {
        cc.warn('onJoystickEndTouch');
        this.moveJoystick = false;
        this.joystick.stopAllActions();
        this.joystick.runAction(cc.moveTo(.3, 200, 200));
        this.normal = cc.v2(0, 0);

    }

    onJoystickCancelTouch(e) {

    }

    ClampMagnitude(v, maxLength) {
        v = v.sub(this.node.getPosition())
        this.Direction = v.normalize()
        if (v.magSqr() > (maxLength * maxLength)) {
            this.Magnitude = 1
            return v.normalize().mul(maxLength).add(this.Center)
        }
        this.Magnitude = v.mag() / maxLength
        return v.add(this.Center)
    }

    getNormal() {
        return this.normal;
    }

    // update (dt) {}
}
