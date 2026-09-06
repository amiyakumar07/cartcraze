package com.example.ui.screens

import android.media.MediaPlayer
import android.view.SurfaceHolder
import android.view.SurfaceView
import android.view.ViewGroup
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.example.R
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun SplashScreen(
    onSplashComplete: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    // Track if video has finished or errored
    var videoCompleted by remember { mutableStateOf(false) }
    var videoError by remember { mutableStateOf(false) }

    // Alpha for fade-out after video ends
    val fadeAlpha = remember { Animatable(1f) }

    // When video ends or errors, fade out then call onSplashComplete
    LaunchedEffect(videoCompleted, videoError) {
        if (videoCompleted || videoError) {
            // Brief pause then fade out
            delay(300)
            fadeAlpha.animateTo(
                targetValue = 0f,
                animationSpec = tween(500)
            )
            onSplashComplete()
        }
    }

    // Safety fallback: if video doesn't complete within 10 seconds, proceed anyway
    LaunchedEffect(Unit) {
        delay(10_000L)
        if (!videoCompleted) {
            videoCompleted = true
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color.Black)
            .alpha(fadeAlpha.value),
        contentAlignment = Alignment.Center
    ) {
        // Video surface
        AndroidView(
            modifier = Modifier.fillMaxSize(),
            factory = { ctx ->
                val surfaceView = SurfaceView(ctx).apply {
                    layoutParams = ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                }

                val mediaPlayer = MediaPlayer.create(ctx, R.raw.splash_video)

                surfaceView.holder.addCallback(object : SurfaceHolder.Callback {
                    override fun surfaceCreated(holder: SurfaceHolder) {
                        try {
                            mediaPlayer.setDisplay(holder)
                            mediaPlayer.isLooping = false
                            mediaPlayer.setOnCompletionListener {
                                scope.launch { videoCompleted = true }
                            }
                            mediaPlayer.setOnErrorListener { _, _, _ ->
                                scope.launch { videoError = true }
                                true
                            }
                            mediaPlayer.start()
                        } catch (e: Exception) {
                            scope.launch { videoError = true }
                        }
                    }

                    override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) {
                        // Adjust video size to fill surface while maintaining aspect ratio
                        val videoWidth = mediaPlayer.videoWidth
                        val videoHeight = mediaPlayer.videoHeight
                        if (videoWidth > 0 && videoHeight > 0) {
                            val videoAspect = videoWidth.toFloat() / videoHeight.toFloat()
                            val surfaceAspect = width.toFloat() / height.toFloat()
                            val lp = surfaceView.layoutParams
                            if (videoAspect > surfaceAspect) {
                                lp.width = (height * videoAspect).toInt()
                                lp.height = height
                            } else {
                                lp.width = width
                                lp.height = (width / videoAspect).toInt()
                            }
                            surfaceView.layoutParams = lp
                        }
                    }

                    override fun surfaceDestroyed(holder: SurfaceHolder) {
                        try {
                            mediaPlayer.release()
                        } catch (e: Exception) { /* ignore */ }
                    }
                })

                surfaceView
            }
        )
    }
}
