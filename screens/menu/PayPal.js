import React from "react";
import { View, Text, TouchableOpacity, Modal, WebView } from "react-native";

export default class PayPal extends React.Component {
    state = {
        showModal: false,
        status: "Pending"
    };
    handleResponse = data => {
        if (data.title === "success") {
            this.setState({ showModal: false, status: "Complete" });
        } else if (data.title === "cancel") {
            this.setState({ showModal: false, status: "Cancelled" });
        } else {
            return;
        }
    };
    render() {
        return (
            <View style={{ marginTop: 100 }}>
 
                <TouchableOpacity
                    style={{ width: 300, height: 100 }}
                    onPress={() => this.setState({ showModal: true })}
                >
                    <Text>Pay with Paypal</Text>
                </TouchableOpacity>
                <Text>Payment Status: {this.state.status}</Text>
            </View>
        );
    }
}