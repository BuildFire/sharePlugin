const config = {
    messageText: "",
};
Languages.get((err, res) => {
    console.log('res -=>', res);
    if (err) console.error(err);
    else {
        shareBtn.innerHTML = res.data.screenOne.share.value || res.data.screenOne.share.defaultValue;
        shareText.innerHTML = res.data.screenOne.message.value || res.data.screenOne.message.defaultValue;
    }
});

buildfire.messaging.onReceivedMessage = (message) => {
    if (message.cmd == 'refresh') {
        buildfire.datastore.onUpdate((e) => {
            if (e.tag == "$bfLanguageSettings_en-us") {
                shareBtn.innerHTML = e.data.screenOne.share.value || e.data.screenOne.share.defaultValue;
                shareText.innerHTML = e.data.screenOne.message.value || e.data.screenOne.message.defaultValue;
            }
        });

    }
};


//  Share part -=>


var sharePluginApp = angular.module('sharePlugin', []);
var qrGeneratorUrl = 'https://chart.googleapis.com/chart?chs=180x180&cht=qr&chl=';
var shareUrl = 'http://[appHost]/api/promoProxy/[appId]/';
sharePluginApp.controller('sharePluginCtrl', ['$scope', '$sce', function ($scope, $sce) {
    var view = null;

    $scope.carouselFlags = {
        carouselHasLoaded: false,
        canShowCarousel: false
    };

    $scope.disableShare = false;
    $scope.data = {
        content: {
            carouselImages: [],
            contentBody: "",
            shareMessage: ""
        }
    };

    buildfire.getContext(function (err, context) {
        if (err) {
            console.log(err);
        }
        else {
            $scope.shareUrl = shareUrl.replace('[appHost]', context.cpDomain).replace('[appId]', context.appId);
            $scope.qrCodeUrl = qrGeneratorUrl + $scope.shareUrl;
        }
    });

    $scope.share = function () {
        var shareMessage = '';

        if ($scope.data && $scope.data.content && $scope.data.content.shareMessage) {
            shareMessage = $scope.data.content.shareMessage;
        }
        buildfire.device.share({ subject: "Share App", text: shareMessage, link: $scope.shareUrl });
    };

    function initDeviceSize(callback) {
        $scope.deviceHeight = window.innerHeight;
        $scope.deviceWidth = window.innerWidth;
        $scope.sliderHeight = Math.ceil(9 * $scope.deviceWidth / 16);
        if (callback) {
            if ($scope.deviceWidth == 0 || $scope.deviceHeight == 0) {
                setTimeout(function () {
                    initDeviceSize(callback);
                }, 500);
            } else {
                callback();
                if (!$scope.$$phase && !$scope.$root.$$phase) {
                    $scope.$apply();
                }
            }
        }
    }

    /**
     * bind data to the scope
     **/
    function bind(data) {
        $scope.data = data;
        if (data && data.content && data.content.contentBody) {
            $scope.data.content.contentBody = $sce.trustAsHtml(data.content.contentBody);
        }
        if ($scope.data && $scope.data.content && $scope.data.content.carouselImages) {
            initDeviceSize(function () {
                if (!view) {
                    view = new buildfire.components.carousel.view("#carousel", $scope.data.content.carouselImages);
                } else {
                    view.loadItems($scope.data.content.carouselImages);
                }
                $scope.carouselFlags.carouselHasLoaded = true;
                if (!$scope.$$phase && !$scope.$root.$$phase) {
                    $scope.$apply();
                }
            });
        }

        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply();
        }
    }

    /**
     * Go pull saved data
     **/
    function loadData() {
        buildfire.datastore.get(function (err, result) {
            if (err) {
                console.log('err: ', err);
            }
            else {
                bind(result.data);
            }
        });
    }

    loadData();

    /**
     * when a refresh is triggered get reload data
     **/
    buildfire.datastore.onRefresh(loadData);

    buildfire.datastore.onUpdate(function (result) {
        bind(result.data);
    });

    $scope.cropImage = function (url, settings) {
        var options = {};
        if (!url) {
            return "";
        }
        else {
            if (settings.height) {
                options.height = settings.height;
            }
            if (settings.width) {
                options.width = settings.width;
            }
            return buildfire.imageLib.cropImage(url, options);
        }
    };
}]);
sharePluginApp.directive("loadCarousel", [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var isLoaded = false;
            attrs.$observe("loadCarousel", function () {
                if (!isLoaded) {
                    isLoaded = true;

                    setTimeout(function () {
                        $(elem).find("img").eq(0).on("load", function () {
                            scope.carouselFlags.canShowCarousel = true;
                            scope.$digest();
                        });
                    }, 1000);

                }
            });

        }
    }
}])