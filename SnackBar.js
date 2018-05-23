// @flow

import * as React from "react";
import { Animated, Dimensions } from "react-native";
import styles from "./SnackBarStyles";

const HIDE_AFTER_DURATION_IN_MS = 2500;
type Props = {
  children: React.Node, //only one child
  hideAfterDurationInMs?: number,
  onDidHide?: Function,
  onLayout?: Function
};
type State = {
  translateY: Animated.Value,
  componentHeight: number,
  isVisible: boolean
};

/*
  SnackBar is similar to the material design snack bar.
  It appears/slides in from the bottom of the screen and 
  slides back after certain time interval. It is a 
  container view which can take in a single React component
  as child.

  Usage <--
  <SnackBar
    ref={instance => {
      this.snackBar = instance;
    }}
    hideAfterDurationInMs={5000}
  >
    <View><Text>Snack bar implementation</Text></View>
  </SnackBar>
    -->
  To show the snackbar call this.snackBar.show()
  
  The snack bar will autohide after a default duration of time.
  Optionally one can pass hideAfterDurationInMs as props.
  
  To hide the snack bar explicitly call this.snackBar.hide()

  NOTE: The SnackBar takes only one child react element. 
  It can be used for messaging/notification purpose.
*/
export default class SnackBar extends React.Component<Props, State> {
  props: Props;
  state: State;
  show: Function;
  hide: Function;
  onDidHide: Function;
  handleLayout: Function;

  constructor(props: Props) {
    super(props);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.onDidHide = this.onDidHide.bind(this);
    this.handleLayout = this.handleLayout.bind(this);

    const windowHeight = Dimensions.get("window").height;
    this.state = {
      translateY: new Animated.Value(windowHeight),
      componentHeight: 0,
      isVisible: false
    };
  }

  handleLayout({ nativeEvent }: any) {
    this.setState(
      {
        componentHeight: nativeEvent.layout.height,
        translateY: new Animated.Value(nativeEvent.layout.height)
      },
      () => {
        if (this.props.onLayout) {
          this.props.onLayout();
        }
      }
    );
  }

  show() {
    Animated.timing(this.state.translateY, {
      toValue: 0,
      duration: 400
    }).start(() => {
      this.setState({ isVisible: true }, () => {
        this.hide(
          this.props.hideAfterDurationInMs || HIDE_AFTER_DURATION_IN_MS
        );
      });
    });
  }

  onDidHide() {
    if (this.props.onDidHide) {
      this.props.onDidHide();
    }
  }

  hide(afterDuration: number) {
    setTimeout(() => {
      Animated.timing(this.state.translateY, {
        toValue: this.state.componentHeight,
        duration: 250
      }).start(() => {
        this.setState({ isVisible: false }, this.onDidHide);
      });
    }, afterDuration);
  }
  render() {
    return (
      <Animated.View
        onLayout={this.handleLayout}
        style={[
          { transform: [{ translateY: this.state.translateY }] },
          styles.container
        ]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
