import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, NativeModules, Image, TouchableOpacity, SafeAreaView, ActionSheetIOS } from 'react-native';
import { Row, Col, ActionSheet, Root } from 'native-base'
import ImageResizer from 'react-native-image-resizer'
var ImagePicker = NativeModules.ImageCropPicker;

// var ImageResizer = require('react-native-image-resizer').default

const PHOTO_SIZE_LARGE = 170;
const PHOTO_SIZE_MEDIUM = 100;
const PHOTO_SIZE_SMALL = 70;

type Props = {};
export default class App extends Component<Props> {

    constructor(props, context) {
        super(props, context);

        this.state = {
            largeUri: "https://i.pinimg.com/474x/52/fe/c5/52fec54732ea8fa383f614f447aec4ac--avatar-james-cameron-blue-avatar.jpg",
            mediumUri: "https://i.pinimg.com/474x/52/fe/c5/52fec54732ea8fa383f614f447aec4ac--avatar-james-cameron-blue-avatar.jpg",
            smallUri: "https://i.pinimg.com/474x/52/fe/c5/52fec54732ea8fa383f614f447aec4ac--avatar-james-cameron-blue-avatar.jpg",
        }

    }

    optionDispatcherIOS(option) {
        switch (option) {
            case 1:
                this.loadImageFromLibrary()

                break;
            case 2:
                this.takeAPictureFromCamera()
                break;

        }
    }

    optionDispatcherAndroid(option) {
        switch (option) {
            case 1:
                this.takeAPictureFromCamera()
                break;
            case 2:
                this.loadImageFromLibrary()
                break;

        }
    }

    loadImage() {
        ImagePicker.clean().then(() => { console.log("Cleanned directory")});
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Take a Photo', 'Choose from Library', 'Cancel'],
                    destructiveButtonIndex: -1,
                    cancelButtonIndex: 2,
                    title: "Choose a Photo"
                },
                (buttonIndex) => this.optionDispatcherIOS(buttonIndex)
            )
        }
        else {
            ActionSheet.show(
                {
                    options: ['Cancel', 'Take a Photo', 'Choose from Library'],
                    destructiveButtonIndex: -1,
                    cancelButtonIndex: 0,
                    title: "Choose a Photo"
                },
                (buttonIndex) => this.optionDispatcherAndroid(buttonIndex),
            );


        }

    }

    resizePictures(picturePromise) {
        let createResizedImages = picturePromise.then(image => {
            debugger
            console.log(image);
            let pathImage = (Platform.OS === 'ios') ? `file://${image.path}` : image.path;
            return Promise.all([
                new Promise(resolve => resolve({ uri: pathImage })),
                ImageResizer.createResizedImage(pathImage /*image.sourceURL*/, PHOTO_SIZE_MEDIUM, PHOTO_SIZE_MEDIUM, 'JPEG', 100, 0),
                ImageResizer.createResizedImage(pathImage /*image.sourceURL*/, PHOTO_SIZE_SMALL, PHOTO_SIZE_SMALL, 'JPEG', 100, 0)
            ]);
        })
            .catch(e => {
                console.log("Error selecting the picture: ", e)
            });

        createResizedImages.then(values => {
            this.setState({ largeUri: values[0].uri, mediumUri: values[1].uri, smallUri: values[2].uri });
        });

        createResizedImages.catch(e => {
            console.log("Error resizing picture: ", e)
        });

    }

    loadImageFromLibrary() {
        let pickerPicture = ImagePicker.openPicker({
            width: PHOTO_SIZE_LARGE,
            height: PHOTO_SIZE_LARGE,
            cropping: true,
            cropperCircleOverlay: true,
            compressImageMaxWidth: PHOTO_SIZE_LARGE,
            compressImageMaxHeight: PHOTO_SIZE_LARGE,
            compressImageQuality: 1,
            includeExif: false
        });
        this.resizePictures(pickerPicture);
    }

    takeAPictureFromCamera() {
        let cameraPicture = ImagePicker.openCamera({
            width: PHOTO_SIZE_LARGE,
            height: PHOTO_SIZE_LARGE,
            cropping: true,
            cropperCircleOverlay: true,
            compressImageMaxWidth: PHOTO_SIZE_LARGE,
            compressImageMaxHeight: PHOTO_SIZE_LARGE,
            compressImageQuality: 1,
            includeExif: false
        })
        this.resizePictures(cameraPicture)
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Root>
                        <Row style={styles.imagePickerRow}>
                            <Col style={styles.pickerCol}>
                                <Text style={styles.selectPictureText}>Select Picture</Text>
                                <TouchableOpacity onPress={() => { this.loadImage() }}>
                                    <Image
                                        style={styles.pickerImg}
                                        resizeMode='cover'
                                        source={{ uri: this.state.largeUri }}
                                    />
                                </TouchableOpacity>
                            </Col>
                        </Row>

                        <Row style={styles.previewRow}>
                            <Col style={styles.previewLargeCol}>
                                <Image
                                    style={styles.largeAvatarImg}
                                    resizeMode='cover'
                                    source={{ uri: this.state.largeUri }}
                                />
                            </Col>
                            <Col style={styles.previewMediumCol}>
                                <Image
                                    style={styles.mediumAvatarImg}
                                    resizeMode='cover'
                                    source={{ uri: this.state.mediumUri }}
                                />
                            </Col>
                            <Col style={styles.previewSmallCol}>
                                <Image
                                    style={styles.smallAvatarImg}
                                    resizeMode='cover'
                                    source={{ uri: this.state.smallUri }}
                                />
                            </Col>
                        </Row>
                    </Root>
                </View>
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imagePickerRow: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        height: 380,
    },
    pickerCol: {
        margin: 15,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#FF0000',
    },
    pickerImg: {
        paddingVertical: 0,
        width: PHOTO_SIZE_LARGE,
        height: PHOTO_SIZE_LARGE,
        borderRadius: 0
    },
    selectPictureText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },

    previewRow: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        height: PHOTO_SIZE_LARGE,
    },

    previewLargeCol: {
        // backgroundColor: '#FF0000',
        width: PHOTO_SIZE_LARGE,
        margin: 3
    },

    previewMediumCol: {
        // backgroundColor: '#00FF00',
        width: PHOTO_SIZE_MEDIUM,
        margin: 3
    },

    previewSmallCol: {
        // backgroundColor: '#0000FF',
        width: PHOTO_SIZE_SMALL,
        margin: 3
    },

    largeAvatarImg: {
        height: PHOTO_SIZE_LARGE,
        width: PHOTO_SIZE_LARGE,
        // borderColor: '#000000',
        // borderWidth: 1,
        borderRadius: PHOTO_SIZE_LARGE / 2
    },
    mediumAvatarImg: {
        height: PHOTO_SIZE_MEDIUM,
        width: PHOTO_SIZE_MEDIUM,
        // borderColor: '#000000',
        // borderWidth: 1,
        borderRadius: PHOTO_SIZE_MEDIUM / 2
    },
    smallAvatarImg: {
        height: PHOTO_SIZE_SMALL,
        width: PHOTO_SIZE_SMALL,
        // borderColor: '#000000',
        // borderWidth: 1,
        borderRadius: PHOTO_SIZE_SMALL / 2
    },







});
