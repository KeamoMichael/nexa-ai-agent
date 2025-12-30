package com.nexa.ai;

import android.graphics.Color;
import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Make the app content overlay system bars (edge-to-edge)
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        
        // Set transparent system bars
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);
    }
}
