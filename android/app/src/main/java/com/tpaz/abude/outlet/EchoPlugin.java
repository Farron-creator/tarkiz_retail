package com.tpaz.abude.outlet;


import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.dantsu.escposprinter.connection.DeviceConnection;
import com.dantsu.escposprinter.connection.bluetooth.BluetoothConnection;
import com.dantsu.escposprinter.connection.bluetooth.BluetoothPrintersConnections;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.tpaz.abude.outlet.async.AsyncBluetoothEscPosPrint;
import com.tpaz.abude.outlet.async.AsyncEscPosPrint;
import com.tpaz.abude.outlet.async.AsyncEscPosPrinter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@CapacitorPlugin(name = "Echo")
public class EchoPlugin extends Plugin {


    public interface OnBluetoothPermissionsGranted {
        void onPermissionsGranted();
    }

    public static final int PERMISSION_BLUETOOTH = 1;
    public static final int PERMISSION_BLUETOOTH_ADMIN = 2;
    public static final int PERMISSION_BLUETOOTH_CONNECT = 3;
    public static final int PERMISSION_BLUETOOTH_SCAN = 4;

    public OnBluetoothPermissionsGranted onBluetoothPermissionsGranted;


    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        getActivity().onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            switch (requestCode) {
                case EchoPlugin.PERMISSION_BLUETOOTH:
                case EchoPlugin.PERMISSION_BLUETOOTH_ADMIN:
                case EchoPlugin.PERMISSION_BLUETOOTH_CONNECT:
                case EchoPlugin.PERMISSION_BLUETOOTH_SCAN:
                    this.checkBluetoothPermissions(this.onBluetoothPermissionsGranted);
                    break;
            }
        }
    }

    public void checkBluetoothPermissions(OnBluetoothPermissionsGranted onBluetoothPermissionsGranted) {
        this.onBluetoothPermissionsGranted = onBluetoothPermissionsGranted;
        if (android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.S && ContextCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.BLUETOOTH}, EchoPlugin.PERMISSION_BLUETOOTH);
        } else if (android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.S && ContextCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_ADMIN) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.BLUETOOTH_ADMIN}, EchoPlugin.PERMISSION_BLUETOOTH_ADMIN);
        } else if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S && ContextCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.BLUETOOTH_CONNECT}, EchoPlugin.PERMISSION_BLUETOOTH_CONNECT);
        } else if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S && ContextCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.BLUETOOTH_SCAN}, EchoPlugin.PERMISSION_BLUETOOTH_SCAN);
        } else {
            this.onBluetoothPermissionsGranted.onPermissionsGranted();
        }
    }

    private BluetoothConnection selectedDevice;

    public void browseBluetoothDevice() {
        this.checkBluetoothPermissions(() -> {
            final BluetoothConnection[] bluetoothDevicesList = (new BluetoothPrintersConnections()).getList();

            if (bluetoothDevicesList != null) {
                final String[] items = new String[bluetoothDevicesList.length + 1];
                items[0] = "Default printer";
                int i = 0;
                for (BluetoothConnection device : bluetoothDevicesList) {
                    items[++i] = device.getDevice().getName();
                }

                AlertDialog.Builder alertDialog = new AlertDialog.Builder(getContext());
                alertDialog.setTitle("Bluetooth printer selection");
                alertDialog.setItems(
                        items,
                        (dialogInterface, i1) -> {
                            int index = i1 - 1;
                            if (index == -1) {
                                selectedDevice = null;
                            } else {
                                selectedDevice = bluetoothDevicesList[index];
                            }
//                            Button button = (Button) findViewById(R.id.button_bluetooth_browse);
//                            button.setText(items[i1]);
                        }
                );

                AlertDialog alert = alertDialog.create();
                alert.setCanceledOnTouchOutside(false);
                alert.show();
            }
        });

    }

    public void defaultFirstBluetoothDevice() {
        this.checkBluetoothPermissions(() -> {
            final BluetoothConnection[] bluetoothDevicesList = (new BluetoothPrintersConnections()).getList();

            if (bluetoothDevicesList != null) {
                final String[] items = new String[bluetoothDevicesList.length + 1];
                items[0] = "Default printer";
                int i = 0;
                for (BluetoothConnection device : bluetoothDevicesList) {
                    items[++i] = device.getDevice().getName();
                }
                selectedDevice = bluetoothDevicesList[0];

            }
        });

    }

    public void printBluetooth(String textPrint) {

        this.checkBluetoothPermissions(() -> {
            new AsyncBluetoothEscPosPrint(
                    getContext(),
                    new AsyncEscPosPrint.OnPrintFinished() {
                        @Override
                        public void onError(AsyncEscPosPrinter asyncEscPosPrinter, int codeException) {
                            Log.e("Async.OnPrintFinished", "AsyncEscPosPrint.OnPrintFinished : An error occurred !");
                        }

//                        @Override
//                        public void onError(AsyncEscPosPrinter asyncEscPosPrinter, int codeException) {
//                            Log.e("Async.OnPrintFinished", "AsyncEscPosPrint.OnPrintFinished : An error occurred !");
//                        }

                        @Override
                        public void onSuccess(AsyncEscPosPrinter asyncEscPosPrinter) {
                            Log.i("Async.OnPrintFinished", "AsyncEscPosPrint.OnPrintFinished : Print is finished !");
                        }
                    }
            )
                    .execute(this.getAsyncEscPosPrinter(selectedDevice,textPrint));
        });
    }

    @SuppressLint("SimpleDateFormat")
    public AsyncEscPosPrinter getAsyncEscPosPrinter(DeviceConnection printerConnection, String textPrint) {
        SimpleDateFormat format = new SimpleDateFormat("'on' yyyy-MM-dd 'at' HH:mm:ss");
        AsyncEscPosPrinter printer = new AsyncEscPosPrinter(printerConnection, 203, 48f, 32);
        return printer.addTextToPrint(textPrint);
//        return printer.addTextToPrint(
////                "[C]<img>" + PrinterTextParserImg.bitmapToHexadecimalString(printer, this.getContext().getResources().getDrawableForDensity(R.drawable.logo, DisplayMetrics.DENSITY_MEDIUM)) + "</img>\n" +
//                        "[L]\n" +
//                        "[C]<u><font size='big'>Minimarket Bauntung</font></u>\n" +
//                        "[L]\n" +
//                        "[C]<u type='double'>" + format.format(new Date()) + "</u>\n" +
//                        "[C]\n" +
//                        "[C]================================\n" +
//                        "[L]\n" +
//                        "[L]<b>BEAUTIFUL SHIRT</b>[R]9.99€\n" +
//                        "[L]  + Size : S\n" +
//                        "[L]\n" +
//                        "[L]<b>AWESOME HAT</b>[R]24.99€\n" +
//                        "[L]  + Size : 57/58\n" +
//                        "[L]\n" +
//                        "[C]--------------------------------\n" +
//                        "[R]TOTAL PRICE :[R]34.98€\n" +
//                        "[R]TAX :[R]4.23€\n" +
//                        "[L]\n" +
//                        "[C]================================\n" +
//                        "[L]\n" +
//                        "[L]<u><font color='bg-black' size='tall'>Customer :</font></u>\n" +
//                        "[L]Raymond DUPONT\n" +
//                        "[L]5 rue des girafes\n" +
//                        "[L]31547 PERPETES\n" +
//                        "[L]Tel : +33801201456\n" +
//                        "\n" +
//                        "[C]<barcode type='ean13' height='10'>831254784551</barcode>\n" +
//                        "[L]\n" +
//                        "[C]<qrcode size='20'>https://dantsu.com/</qrcode>\n"
//        );
    }

    public static List<String> splitOutlet(String outlet) {
        List<String> result = new ArrayList<>();
        if (outlet.length() <= 15) {
            result.add(outlet);
            return result;
        }

        String[] words = outlet.split(" ");
        StringBuilder currentSegment = new StringBuilder();

        for (String word : words) {
            if (currentSegment.length() + word.length() + 1 <= 15) {
                if (currentSegment.length() > 0) {
                    currentSegment.append(" ");
                }
                currentSegment.append(word);
            } else {
                if (currentSegment.length() > 0) {
                    result.add(currentSegment.toString());
                    currentSegment.setLength(0);
                }
                currentSegment.append(word);
            }
        }

        if (currentSegment.length() > 0) {
            result.add(currentSegment.toString());
        }

        return result;
    }

    @PluginMethod()
    public void echo(PluginCall call) throws JSONException {
//        browseBluetoothDevice();
        defaultFirstBluetoothDevice();
        //printBluetooth();
        String value = call.getString("value");
        assert value != null;
        Log.d("value cetak",value);

        JSONObject data = new JSONObject(value);
        Log.d("value data",data.toString());
        String code = data.getString("code");
        String notes = data.getString("note").substring(0, Math.min(data.getString("note").length(), 10));
        String totalHarga = String.valueOf(data.getInt("total"));
        String customer = data.getString("customer");
        String outlet = data.getString("company");
        JSONArray items = data.getJSONArray("items");
        List<String> printedOutlet = splitOutlet(outlet);

        SimpleDateFormat format = new SimpleDateFormat(" dd-MM-yyyy '|' HH:mm:ss");

        // susun teks untuk di print
        String[] name_outlet = outlet.split(" ");


        StringBuilder teksToPrint = new StringBuilder();
        for (int i=0; i<printedOutlet.size(); i++) {
            teksToPrint.append("[L]\n" + "[C]<u><font size='big'>").append(printedOutlet.get(i)).append("</font></u>\n");
        }
        teksToPrint.append("[L]<u> ").append(code).append(" </u>\n");
        teksToPrint.append("[L]<u> ").append(customer).append(" </u>").append("[R] <u>").append(notes).append("</u> \n");
        teksToPrint.append("[C]<u type='double'>" + format.format(new Date()) + "</u>\n" );
        teksToPrint.append("[C]================================\n");
        for (int i=0; i < items.length(); i++) {

            teksToPrint.append("[L]<b>  ").append(items.getJSONObject(i).getJSONObject("product").getString("name")).append(" </b>").append("[R]").append(items.getJSONObject(i).getInt("total")).append("\n");
            teksToPrint.append("[L]  ").append(items.getJSONObject(i).getInt("quantity")).append(" x ").append(items.getJSONObject(i).getInt("price")).append(" \n");
        }

        teksToPrint.append("[R] <b>TOTAL : ").append(totalHarga).append("</b> \n\n");
        teksToPrint.append("[C]================================\n\n\n");
        printBluetooth(teksToPrint.toString());
        JSObject ret = new JSObject();
        ret.put("value", value);
        call.resolve(ret);
    }

    @PluginMethod()
    public void echo_cash(PluginCall call) throws JSONException {
        defaultFirstBluetoothDevice();
        //printBluetooth();
        String value = call.getString("value");
        assert value != null;
        Log.d("value cetak",value);

        JSONObject data = new JSONObject(value);
        // Log.d("value data",data.toString());
        String type = data.getString("type");
        
        String amount = data.getString("amount");
        String status = data.getString("status");
        String category = data.getString("category");
        String id = data.getString("id");
        // String notes = data.getString("notes");
        // String code = data.getString("code");
        String notes = data.getString("notes").substring(0, Math.min(data.getString("notes").length(), 10));
        // String totalHarga = String.valueOf(data.getInt("total"));
        // String customer = data.getJSONObject("customer").getString("name");
        // String outlet = data.getJSONObject("outlet").getString("name");
        // JSONArray items = data.getJSONArray("items");
        // List<String> printedOutlet = splitOutlet(outlet);

        SimpleDateFormat format = new SimpleDateFormat(" dd-MM-yyyy '|' HH:mm:ss");

        // // susun teks untuk di print
        // String[] name_outlet = outlet.split(" ");


        StringBuilder teksToPrint = new StringBuilder();
        teksToPrint.append("[L]\n" + "[C]<u><font size='big'>").append("Bukti Setor / Tarik Tunai").append("</font></u>\n");
        // for (int i=0; i<printedOutlet.size(); i++) {
        //     teksToPrint.append("[L]\n" + "[C]<u><font size='big'>").append(printedOutlet.get(i)).append("</font></u>\n");
        // }
        teksToPrint.append("[L]<u> ").append(id).append(" </u>\n");
        // teksToPrint.append("[L]<u> ").append(customer).append(" </u>").append("[R] <u>").append(notes).append("</u> \n");
        teksToPrint.append("[C]<u type='double'>" + format.format(new Date()) + "</u>\n" );
        teksToPrint.append("[C]================================\n");
        teksToPrint.append("[L]<b>  ").append("Jenis Transaksi").append(" </b>").append("[R]").append(category).append("\n");
        teksToPrint.append("[L]<b>  ").append("Jumlah").append(" </b>").append("[R]").append(amount).append("\n");
        teksToPrint.append("[L]<b>  ").append("Status").append(" </b>").append("[R]").append("Sukses").append("\n");
        
        // for (int i=0; i < items.length(); i++) {

        //     teksToPrint.append("[L]<b>  ").append(items.getJSONObject(i).getJSONObject("product").getString("name")).append(" </b>").append("[R]").append(items.getJSONObject(i).getInt("total")).append("\n");
        //     teksToPrint.append("[L]  ").append(items.getJSONObject(i).getInt("quantity")).append(" x ").append(items.getJSONObject(i).getInt("price")).append(" \n");
        // }

        // teksToPrint.append("[R] <b>TOTAL : ").append(totalHarga).append("</b> \n\n");
        teksToPrint.append("[C]================================\n\n\n");
        printBluetooth(teksToPrint.toString());
        JSObject ret = new JSObject();
        ret.put("value", value);
        call.resolve(ret);
    }
}