package com.instadownload;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.brentvatne.react.ReactVideoPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.react.rnspinkit.RNSpinkitPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
 
 @Override
 protected ReactGateway createReactGateway() {
     ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
         @Override
         protected String getJSMainModuleName() {
             return "index";
         }
     };
     return new ReactGateway(this, isDebug(), host);
 }
 @Override
 public boolean isDebug() {
     return BuildConfig.DEBUG;
 }
 protected List<ReactPackage> getPackages() {
     // Add additional packages you require here
     // No need to add RnnPackage and MainReactPackage
     return Arrays.<ReactPackage>asList(
        new RNFetchBlobPackage(),
        new RNSpinkitPackage(),
        new RNDeviceInfo(),
        new MainReactPackage(),
        new ReactVideoPackage()
         // eg. new VectorIconsPackage()
     );
 }
  @Override
 public List<ReactPackage> createAdditionalReactPackages() {
     return getPackages();
 }
}
