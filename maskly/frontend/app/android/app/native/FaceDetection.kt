package com.maskly.app.native

import android.graphics.Bitmap
import com.google.mlkit.vision.face.Face
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import com.google.mlkit.vision.common.InputImage

/**
 * Class for performing face detection using Google ML Kit.
 */
class FaceDetection {
    private val options = FaceDetectorOptions.Builder()
        .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
        .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_ALL)
        .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_ALL)
        .build()

    private val detector = FaceDetection.getClient(options)

    /**
     * Detects faces in the given bitmap and invokes the callback with the results.
     *
     * @param bitmap The input image as a Bitmap.
     * @param callback A function to handle the list of detected faces.
     */
    fun detectFaces(bitmap: Bitmap, callback: (Result<List<Face>>) -> Unit) {
        try {
            val image = InputImage.fromBitmap(bitmap, 0)
            detector.process(image)
                .addOnSuccessListener { faces ->
                    callback(Result.success(faces))
                }
                .addOnFailureListener { e ->
                    callback(Result.failure(e))
                }
        } catch (e: Exception) {
            callback(Result.failure(e))
        }
    }

    /**
     * Closes the face detector to release resources.
     */
    fun closeDetector() {
        try {
            detector.close()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

/**
 * Wrapper class for handling success or failure results.
 */
sealed class Result<out T> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Failure(val exception: Exception) : Result<Nothing>()

    companion object {
        fun <T> success(data: T): Result<T> = Success(data)
        fun failure(exception: Exception): Result<Nothing> = Failure(exception)
    }
}

